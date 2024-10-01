<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Carbon\Carbon;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    
    return redirect()->route('login');

});

Route::get('/dashboard', function (Request $request) {
    $countorders = Order::count();
    $countuser = User::where('name', 'like', '%')->role('user')->count();
    $countpendingorder = Order::where('status', 'pending')->count();
    $countcompletedorder = Order::where('status', 'completed')->count();
    $cancelledorder = Order::where('status', 'cancelled')->count();

    $query = Order::query();

    // Apply search filters
    if ($request->input('search')) {
        $query->where(function ($q) use ($request) {
            $q->where('name', 'like', '%' . $request->input('search') . '%')
              ->orWhere('email', 'like', '%' . $request->input('search') . '%')
              ->orWhere('phone', 'like', '%' . $request->input('search') . '%')
              ->orWhere('id', 'like', '%' . $request->input('search') . '%');
        });
    }
    $today = Carbon::now()->startOfDay();
    $salesToday = Order::whereDate('created_at', $today)->sum('payable');

    $thisWeekStart = Carbon::now()->startOfWeek();
    $salesThisWeek = Order::whereBetween('created_at', [$thisWeekStart, Carbon::now()])->sum('payable');

    $thisMonthStart = Carbon::now()->startOfMonth();
    $salesThisMonth = Order::whereBetween('created_at', [$thisMonthStart, Carbon::now()])->sum('payable');

    // Date range filters
    // $today = Carbon::now()->startOfDay();
    // $thisWeekStart = Carbon::now()->startOfWeek();
    // $thisMonthStart = Carbon::now()->startOfMonth();

    // $salesToday = Order::whereDate('created_at', $today);
    // $salesThisWeek = Order::whereBetween('created_at', [$thisWeekStart, Carbon::now()])->sum('payable');
    // $salesThisMonth = Order::whereBetween('created_at', [$thisMonthStart, Carbon::now()])->sum('payable');

    // Apply status filter
    if ($request->input('status')) {
        $query->where('status', $request->input('status'));
    }

    $orders = $query->with('shippingRate')->orderBy('id', 'desc')->paginate(5);

    return Inertia::render('Dashboard', [
        'countuser' => $countuser,
        'countpendingorder' => $countpendingorder,
        'countcompletedorder' => $countcompletedorder,
        'countorders' => $countorders,
        'cancelledorder' => $cancelledorder,
        'orders' => $orders,
        'salesToday' => $salesToday,
        'salesThisWeek' => $salesThisWeek,
        'salesThisMonth' => $salesThisMonth
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::get('/order', function () {
    return Inertia::render('order/Order');
})->name('order');

require __DIR__.'/auth.php';
require __DIR__.'/dashboard/user.php';
require __DIR__.'/dashboard/product.php';
require __DIR__.'/dashboard/category.php';
require __DIR__.'/dashboard/order.php';
require __DIR__.'/dashboard/coupon.php';
require __DIR__.'/dashboard/setting.php';
require __DIR__.'/dashboard/adminManagement.php';
require __DIR__.'/dashboard/shipment.php';
require __DIR__.'/dashboard/variation.php';
require __DIR__.'/dashboard/attribute.php';
require __DIR__.'/dashboard/attributeValue.php';
require __DIR__.'/dashboard/role.php';
