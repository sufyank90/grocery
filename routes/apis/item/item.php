<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Item;
use App\Models\Order;
use Illuminate\Support\Facades\Validator;

Route::middleware('auth:sanctum')->prefix('item')->group(function () {

    // Get items for a specific order
    Route::get('{order}/items', function (Request $request, $order) {
        $order = Order::with('items')->findOrFail($order);
        
        // Ensure the authenticated user owns the order
        if ($order->user_id !== $request->user()->id) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        return response()->json(["data" => $order->items, "message" => "success"], 200);
    });

    // Add item to a specific order
    Route::post('{order}/items', function (Request $request, $order) {
        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|integer',
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'price' => 'required|numeric',
            'qty' => 'required|integer|min:1',
            'status' => 'required|in:instock,outofstock,active',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validatedData = $validator->validated();

        // Find the order
        $order = Order::findOrFail($order);

        // Ensure the authenticated user owns the order
        if ($order->user_id !== $request->user()->id) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        // Create a new item and associate it with the order
        $item = $order->items()->create($validatedData);

        return response()->json(["data" => $item, "message" => "Item created successfully"], 201);
    });

});
