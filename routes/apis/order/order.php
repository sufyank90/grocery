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
    
 
        $orders = Order::where('user_id', $user->id)
        ->where('paymentstatus','!=','Failed')
        ->with('items','items.variation')
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
                'delivery_charges' => 'nullable|numeric',
                'paymentstatus'=>'nullable|string',
                'walletdiscount' => 'nullable|numeric'
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
            $coupon = Coupon::with('users')->where('code', $request->couponcode)->where('status', 'active')->where('expiry_date', '>', Carbon::now())->where('usage_limit', '>', 0)->first();

            //check if already used by user
            if ($coupon->users->contains($user->id)) {
                return response()->json(["message" => "Coupon code already used"], 400);
            }

            if (!$coupon) {
                return response()->json(["message" => "Coupon code is invalid or expired"], 400);
            }
            if ($coupon->usage_type === 'single') {
                $coupon->usage_limit = 0; // Single-use coupon, now used up
                $user->coupons()->attach($coupon->id);
            } 
            elseif ($coupon->usage_type === 'multiple') {
                $coupon->decrement('usage_limit'); // Decrease usage limit by 1
                $user->coupons()->attach($coupon->id);
            }
            $coupon->save();
        }
       
              

        // Create a new order with the validated data
        $order = Order::create(array_merge($validatedData, [
            'user_id' => $user->id,
            
        ]));

        if($validatedData['walletdiscount'] > 0 && $validatedData['method'] != 'wallet'){
            $user->wallet = $user->wallet - $validatedData['walletdiscount'];
            $user->save();
        }

        if($validatedData['method'] == 'wallet'){
            $user->wallet = $user->wallet - $validatedData['total'];
            $user->save();
        }
        Notification::send($order->user, new OrderNotification($order));
        if($request->method == 'card')
        {
            return response()->json(["data" => ['id' => $order->id, 'payable' => $request->payable, 'link' => '/payment/'. $order->id.'/card/' ], "message" => "Redirecting to payment page"], 201);
        }
        return response()->json(["data" => $order, "message" => "Order created successfully"], 201);
    });


    Route::post('/wallet-check', function (Request $request) {
        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:1',
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
    
        // Retrieve validated data
        $validatedData = $validator->validated();
    
        // Get the currently authenticated user
        $user = $request->user();
    
        if (!$user) {
            return response()->json([
                'message' => 'User not authenticated.'
            ], 401); // 401 Unauthorized
        }
    
        // Check if wallet balance is zero
        if ($user->wallet == 0) {
            return response()->json([
                'message' => 'Insufficient wallet balance. Wallet is empty.'
            ], 400); // 400 Bad Request
        }
    
        // Calculate the amount to deduct from the wallet
        $deductedAmount = min($user->wallet, $validatedData['amount']);
    
        // Deduct the amount from the wallet
        $user->wallet -= $deductedAmount;
        $user->save();
    
        // Calculate the remaining amount to be processed
        $remainingAmount = $validatedData['amount'] - $deductedAmount;
    
        return response()->json([
            'message' => 'Amount processed successfully.',
            'deducted_from_wallet' => $deductedAmount,
            'remaining_amount' => $remainingAmount,
            'wallet_balance' => $user->wallet,
        ], 200); // 200 OK
    });
    
    

});
