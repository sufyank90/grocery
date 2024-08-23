<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Coupon;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $orders = Order::orderBy('id', 'desc')->paginate(10);

        return Inertia::render('order/Order', compact('orders'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $nextId = Order::max('id') + 1;
        $users = User::all();
        $products = Product::with('categories')->get();
        $coupons = Coupon::all();
        return Inertia::render('order/Create', [
            'nextId' => $nextId,
            'users' => $users,
            'products' => $products,
            'coupons' => $coupons
        ]);
    }

    // order.status
    public function status(Request $request,$id)
    {
        $order = Order::find($id);
        $order->status = $request->status;
        if($request->status == 'cancelled'){
            $order->reason = $request->reason;
        }
        $order->save();
        return back();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreOrderRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreOrderRequest $request)
    {
        $order = Order::create($request->validated());
        $order->items()->createMany($request->items);
        if ($request->coupon) {
            $coupon = Coupon::where('code', $request->couponcode)->first();
            if ($coupon) {
                $coupon->usage_limit = $coupon->usage_limit - 1;
                $coupon->save();
            }
        }
        return back();
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateOrderRequest  $request
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateOrderRequest $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function destroy(Order $order)
    {
        //
    }
}
