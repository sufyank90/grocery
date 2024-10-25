<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Notification;
use App\Notifications\OrderNotification;
use Carbon\Carbon;
use App\Models\Coupon;

Route::middleware('auth:sanctum')->prefix('order')->group(function () {

    Route::get('', function (Request $request) {
        // Get the currently authenticated user
        $user = $request->user();
    
 
        $orders = Order::where('user_id', $user->id)->with('items','items.variation')
            ->orderBy('id', 'desc')
            ->get();
        
        return response()->json(["data" => $orders, "message" => "success"], 200);
    });

    Route::post('', function (Request $request) {
        // Validate the incoming request data
      
        $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'address' => 'required|string',
                'zipcode' => 'nullable|string|max:10',
                'city' => 'required|string|max:100',
                'country' => 'required|string|max:100',
                'method' => 'required|in:cash,card,wallet,bank-transfer',
                'total' => 'required|numeric',
                'couponcode' => 'nullable|string|max:50',
                'coupontype' => 'nullable|in:fixed,percent',
                'discount' => 'nullable|numeric',
                'status' => 'nullable|string|max:50',
                'payable' => 'required|numeric',
                'shipping_id' => 'required',
        ]);
        if($validator->fails()){
            return response()->json($validator->errors(), 422);
        }




        $validatedData = $validator->validated();

        // Get the currently authenticated user
        $user = $request->user();

        // if (!$user->hasVerifiedEmail()) {
        //     return response()->json([
        //         'message' => 'Your account is not verified. Please check your email for the verification link.'
        //     ], 403); // 403 Forbidden
        // }


        //Huzaifa Shakeel
        if($request->couponcode !== '' && $request->couponcode !== null){
            $coupon = Coupon::where('code', $request->couponcode)->where('status', 'active')->where('expiry_date', '>', Carbon::now())->where('usage_limit', '>', 0)->first();

            if (!$coupon) {
                return response()->json(["message" => "Coupon code is invalid or expired"], 400);
            }
            if ($coupon->usage_type === 'single') {
                $coupon->usage_limit = 0; // Single-use coupon, now used up
            } 
            elseif ($coupon->usage_type === 'multiple') {
                $coupon->decrement('usage_limit'); // Decrease usage limit by 1
            }
            $coupon->save();
        }
       
              

        // Create a new order with the validated data
        $order = Order::create(array_merge($validatedData, [
            'user_id' => $user->id,
            
        ]));
        if($validatedData['method'] == 'wallet'){
            $user->wallet = $user->wallet - $validatedData['total'];
            $user->save();
        }



        
        Notification::send($order->user, new OrderNotification($order));
        return response()->json(["data" => $order, "message" => "Order created successfully"], 201);
    });




});
