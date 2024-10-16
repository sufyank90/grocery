<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Validator;
use App\Models\Product;
use App\Models\Category;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});



Route::post('/search', function (Request $request) {
    $validator = Validator::make($request->all(), [
        'search' => 'required',
        'shipping_area' => 'required',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 422);
    }

    $validatedData = $validator->validated();
    $searchTerm = $validatedData['search'];
    $shipping_area = $validatedData['shipping_area'];

    // Search Products
    $productQuery = Product::with('categories', 'media', 'shipping_rates');

    if ($shipping_area) {
        $productQuery->where(function ($q) use ($shipping_area) {
            $q->whereHas('shipping_rates', function ($q) use ($shipping_area) {
                $q->where('id', $shipping_area);
            })
            ->orWhereDoesntHave('shipping_rates');
        });
    } else {
        $productQuery->whereDoesntHave('shipping_rates');
    }

    // Add search conditions for product fields
    $productQuery->where(function ($q) use ($searchTerm) {
        $q->orWhere('name', 'like', '%' . $searchTerm . '%');
    });

    $products = $productQuery->orderBy('id', 'desc')->limit(10)->get();

    // Search Categories
    $categoryQuery = Category::with('media');

    // Add search conditions for category fields
    $categoryQuery->where(function ($q) use ($searchTerm) {
        $q->orWhere('name', 'like', '%' . $searchTerm . '%'); // Assuming you have a description field
    });

    $categories = $categoryQuery->orderBy('id', 'desc')->limit(10)->get();

    $result = [
        'products' => $products,
        'categories' => $categories,
    ];

    return response()->json(["data" => $result, "message" => "success"], 200);
});

include __DIR__ . '/apis/auth/auth.php';
include __DIR__ . '/apis/category/getcategory.php';
include __DIR__ . '/apis/product/getproduct.php';
include __DIR__ . '/apis/order/order.php';
include __DIR__ . '/apis/item/item.php';
include __DIR__ . '/apis/coupon/getcoupon.php';
include __DIR__ . '/apis/shippingrate/getshippingrate.php';
include __DIR__ . '/apis/banner/getbanner.php';
include __DIR__ . '/apis/wishlist/wishlist.php';
include __DIR__ . '/apis/feedback/feedback.php';
include __DIR__ . '/apis/notification/notification.php';
include __DIR__ . '/apis/redeemCoins/redeemCoins.php';
include __DIR__ . '/apis/variation/variation.php';
