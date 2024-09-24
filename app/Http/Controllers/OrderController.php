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
use App\Models\Attribute;
use App\Models\ShippingRate;


use Illuminate\Support\Facades\Notification;
use App\Notifications\OrderNotification;



class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
{
    $query = Order::query();

    // Apply search filters
    if ($request->filled('search')) {
        $query->where(function ($q) use ($request) {
            $q->where('name', 'like', '%' . $request->search . '%')
              ->orWhere('email', 'like', '%' . $request->search . '%')
              ->orWhere('phone', 'like', '%' . $request->search . '%')
              ->orWhere('id', 'like', '%' . $request->search . '%');
        });
    }

    // Apply status filter
    if ($request->filled('status')) {
        $query->where('status', $request->status);
    }

    // Eager load the shippingRate relationship and paginate
    $orders = $query->with('shippingRate','user')->orderBy('id', 'desc')->paginate(10);

    // Return the data to the Inertia view
    return Inertia::render('order/Order', [
        'orders' => $orders,
    ]);
}


    

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    // public function create()
    // {
    //     $nextId = Order::max('id') + 1;
    //     $users = User::all();
    //     $products = Product::with('categories')->get();
    //     $coupons = Coupon::all();
    //     return Inertia::render('order/Create', [
    //         'nextId' => $nextId,
    //         'users' => $users,
    //         'products' => $products,
    //         'coupons' => $coupons
    //     ]);


    // }

    public function create()
    {
        
        // Get the next order ID
        $nextId = Order::max('id') + 1;

        // Fetch all users, products, and coupons
        $users = User::all();
        $products = Product::with('categories')->get();
        $coupons = Coupon::all();

        // Fetch all shipping rates with id and area_name
        $shippingRates = ShippingRate::all(['id', 'area_name']);

        // Format shipping rates for use in the front-end
        $formattedShippingRates = $shippingRates->map(function ($item) {
            return [
                'value' => $item->id,
                'label' => $item->area_name,
            ];
        });




        // Pass all data to the Inertia view for order creation
        return Inertia::render('order/Create', [
            'nextId' => $nextId,
            'users' => $users,
            'products' => $products,
            'coupons' => $coupons,
            'shippingRates' => $formattedShippingRates, // Add shipping rates here
        ]);
    }

    // order.status
    public function status(Request $request, $id)
{
    // Debugging: Output all request data
    //dd($request->all()); // You might want to comment this out after testing
   
    $order = Order::find($id);

    if ($order) {
        $status = $request->status;
        $order->update(['status'=>$status]);

        if ($request->status == 'cancelled') {
            $reason = $request->reason;
            $order->update(['reason'=>$reason]);
        }

      

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }

    return redirect()->back()->with('error', 'Order not found.');
}

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreOrderRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreOrderRequest $request)
    {
        // Validate the request and create the order
        $orderData = $request->validated();
    
        // Create the order
        $order = Order::create($orderData);
    
        // Create items associated with the order
        if (isset($request->items) && is_array($request->items)) {
            $order->items()->createMany($request->items);
        }
    
        // Handle coupon usage
        if (!empty($request->coupon)) {
            $coupon = Coupon::where('code', $request->couponcode)->first();
            if ($coupon) {
                $coupon->usage_limit = $coupon->usage_limit - 1;
                $coupon->save();
            }
        }
    
        // Assign shipping_id if provided
        if (isset($request->shipping_rates) && !empty($request->shipping_rates)) {
            $order->update(['shipping_id' => $request->shipping_rates]);
        }

        Notification::send($order->user, new OrderNotification($order));
    
        return redirect()->route('order.index');
    }
    

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function show(Order $order)

    {
        
      // Load the order with its items and feedbacks
      $orderWithDetails = $order->load(['items','items.variation', 'feedbacks']);

      $attribute = Attribute::with('attributeValues')->get();

      return Inertia::render('order/View', [
          'order' => $orderWithDetails, // Pass the order with its items and feedbacks
          'attribute' => $attribute
      ]);

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function edit(Product $product)
    {
        $products = Category::all();

        $product->load(['categories', 'media']);

        return Inertia::render('product/Edit', [
        'categories' => $categories,
        'product' => $product,
    ]);
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
