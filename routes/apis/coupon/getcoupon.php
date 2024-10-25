<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Coupon;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
 
Route::middleware('auth:sanctum')->prefix('coupon')->group(function () {

    // Get all coupons
    Route::get('', function (Request $request) {
        $coupons = Coupon::orderBy('id', 'desc')->get();
        return response()->json(["data" => $coupons, "message" => "success"], 200);
    });

    // Create a new coupon
    Route::post('', function (Request $request) {
        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|unique:coupons,code|max:255',
            'type' => 'required|in:fixed,percent',
            'value' => 'required|numeric',
            'usage_type' => 'required|in:single,multiple,infinite',
            'usage_limit' => 'nullable|integer|min:1',
            'minimum_amount' => 'nullable|numeric|min:0',
            'limit' => 'nullable|integer|min:1',
            'expiry_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validatedData = $validator->validated();

        // Create a new coupon
        $coupon = Coupon::create($validatedData);

        return response()->json(["data" => $coupon, "message" => "Coupon created successfully"], 201);
    });

    // Update an existing coupon
    Route::put('{id}', function (Request $request, $id) {
        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'code' => 'nullable|string|unique:coupons,code,' . $id . '|max:255',
            'type' => 'nullable|in:fixed,percent',
            'value' => 'nullable|numeric',
            'usage_type' => 'nullable|in:single,multiple,infinite',
            'usage_limit' => 'nullable|integer|min:1',
            'expiry_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validatedData = $validator->validated();

        // Find the coupon
        $coupon = Coupon::findOrFail($id);

        // Update the coupon
        $coupon->update($validatedData);

        return response()->json(["data" => $coupon, "message" => "Coupon updated successfully"], 200);
    });

    // Delete a coupon
    Route::delete('{id}', function ($id) {
        // Find the coupon
        $coupon = Coupon::findOrFail($id);

        // Delete the coupon
        $coupon->delete();

        return response()->json(["message" => "Coupon deleted successfully"], 200);
    });


    Route::post('applycoupon', function (Request $request) {
       
        $request->validate([
            'code' => 'required',
            'amount' => 'required|numeric|min:0'
        ]);

        
    
        $coupon = Coupon::where('code', $request->code)->first();
    
        if (!$coupon) {
            return response()->json(['message' => 'Coupon not found'], 404);
        }
    
        // Check if the coupon is expired

        //apply carbon
        $expiry_date = Carbon::parse($coupon->expiry_date);

        if ($coupon->expiry_date && $expiry_date->isPast()) {
            return response()->json(['message' => 'Coupon has expired'], 400);
        }
    
        // Check if the coupon has a usage limit and if it has been exceeded
        if ($coupon->usage_type !== 'infinite' && $coupon->usage_limit <= 0) {
            return response()->json(['message' => 'Coupon usage limit exceeded'], 400);
        }
    
        // Apply the coupon based on its type
        if ($coupon->type === 'fixed') {
            $discount = min($coupon->value, $request->amount); // Fixed amount discount, but not exceeding the total amount
        } elseif ($coupon->type === 'percent') {
            $discount = $request->amount * ($coupon->value / 100); // Percentage discount
        }
    
          //Huzaifa Shakeel
        // Update the usage limit if applicable
        // if ($coupon->usage_type === 'single') {
        //     $coupon->usage_limit = 0; // Single-use coupon, now used up
        // } 
        // elseif ($coupon->usage_type === 'multiple') {
        //     $coupon->decrement('usage_limit'); // Decrease usage limit by 1
        // }
    
        // $coupon->save();
    
        return response()->json([
            'message' => 'Coupon applied successfully',
            'discount' => $discount,
            'final_amount' => $request->amount - $discount,  
        ], 200);
    });
    

});
