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
// use MezPay\Facade\MezPayFacade;
use Illuminate\Support\Facades\Http;



use Illuminate\Support\Facades\Notification;
use App\Notifications\OrderNotification;
//Attributevalue
use App\Models\Attributevalue;



class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
{
    $this->authorize('viewAny', Order::class);
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
    
    // Apply date range filters
    if ($request->filled('fromDate') && $request->filled('toDate')) {
        $query->whereBetween('created_at', [$request->toDate,$request->fromDate ]);
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

// public function registerOrder(Request $request)
// {
//     $paymentGateway = MezPayFacade::registerOrder([
//         'order_id' => 152,
//         'currency' => 586, // 586 = PKR | 540 = USD
//         'amount' => 2000,
//     ]);
// }

public function registerOrder(Order $order, Request $request)
{   

    $response = Http::asForm()->post(env('MEZPAY_API_URL') . '/register.do', [
        'userName' => env('MEZPAY_USERNAME'),
        'password' => env('MEZPAY_PASSWORD'),
        'orderNumber' => $order->id, // Unique order ID
        'currency' => 586, // 586 = PKR
        'amount' => $order->payable*100, // Amount in minor units (e.g., 2000 = PKR 20.00)
        'returnUrl' => env('APP_URL') . '/order_payment/success/'.$order->id,
        'failUrl' => env('APP_URL') . '/order_payment/failed/'.$order->id,
    ]);
    // Handle response
    $result = $response->json();

    if (isset($result['formUrl'])) {
        return redirect($result['formUrl']); // Redirect to the payment page
    }

    return response()->json(['error' => $result['errorMessage'] ?? 'Unknown error'], 400);
}


// public function orderSucceeded(Request $request)
//     {
//         // Get the orderId from the URL parameter or any other source as needed
//         $orderId = $request->orderId;

//         // Perform actions for successful payment
//         // For example, update order status, send notifications, etc.

//         // You can also pass the $orderId to a view if needed
//         return view('success', compact('orderId'));
//     }

public function orderSucceeded(Order $order, Request $request)
{
    $orderId = $order->id;

    // Fetch the order status from the payment gateway
    $response = Http::get(env('MEZPAY_API_URL') . '/getOrderStatus.do', [
        'userName' => env('MEZPAY_USERNAME'),
        'password' => env('MEZPAY_PASSWORD'),
        'orderId' => $orderId,
    ]);

    $result = $response->json();

    if ($result['errorCode'] == 0 && $result['orderStatus'] == 2) { // 2 = Payment Successful
        // Perform actions for successful payment, e.g., update order status in database
        // Example:
        Order::find($order->id)->update(['status' => 'paid']);
        return response()->json(['message' => 'Payment successful', 'orderId' => $orderId, 'status' => 'paid']);
    }

    return response()->json(['error' => $result['errorMessage'] ?? 'Unknown error'], 400);
}


    // public function orderFailed(Request $request)
    // {
    //     // Get the orderId from the URL parameter or any other source as needed
    //     $orderId = $request->orderId;

    //     // Perform actions for failed payment
    //     // For example, update order status, send notifications, etc.

    //     // You can also pass the $orderId to a view if needed
    //     return view('failed', compact('orderId'));
    // }

    public function orderFailed(Order $order, Request $request)
{
    // Log or perform actions for failed payment
    // Example:
    Order::find($order->id)->update(['status' => 'failed']);
    return response()->json(['message' => 'Payment failed', 'orderId' => $orderId, 'status' => 'failed']);


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
        $this->authorize('create', Order::class);
        // Get the next order ID
        $nextId = Order::max('id') + 1;

        // Fetch all users, products, and coupons
        $users = User::all();
        $products = Product::with('categories','variations','attributes')->get();
        $attributevalues = Attributevalue::get();
   
       
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
            'attributevalues' => $attributevalues,
            'shippingRates' => $formattedShippingRates, // Add shipping rates here
        ]);
    }

    // order.status
    public function status(Request $request, $id)
{
    // Debugging: Output all request data
    //dd($request->all()); // You might want to comment this out after testing
    $this->authorize('update', Order::find($id));
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
    
        $this->authorize('create', Order::class);
        // Validate the request and create the order
        $orderData = $request->validated();
    
        $orderData['guest'] = $request->guest === '1' ? 1 : 0;
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

        if($request->guest === '0'){
            Notification::send($order->user, new OrderNotification($order));
        }
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
        $this->authorize('viewAny', Order::class);
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
        $this->authorize('update', $product);
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


      //bulkdestroy
      public function bulkdestroy(Request $request)
      {
  
          $this->authorize('bulkdelete',Order::class);
          $ids = explode(',', $request->ids);
          Order::whereIn('id', $ids)->delete();
          session()->flash('message', 'Order deleted successfully.');
      }
}
