<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Notification;
use App\Notifications\OrderNotification;

Route::middleware('auth:sanctum')->prefix('order')->group(function () {

    Route::get('', function (Request $request) {
        // Get the currently authenticated user
        $user = $request->user();
    
 
        $orders = Order::where('user_id', $user->id)->with('items')
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
                'method' => 'required|in:cash,card,wallet',
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
