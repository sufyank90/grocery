<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Coupon;
use Illuminate\Support\Facades\Validator;

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
});
