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
    Route::post('{order}/items', function (Request $request, $orderId) {
        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'items' => 'required|array',
            'items.*.product_id' => 'required|integer',
            'items.*.name' => 'required|string|max:255',
            'items.*.category' => 'required|string|max:255',
            'items.*.price' => 'required|numeric',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.status' => 'required|in:instock,outofstock,active',
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
    
        $validatedData = $validator->validated();
    
        // Find the order
        $order = Order::findOrFail($orderId);
    
        // Ensure the authenticated user owns the order
        if ($order->user_id !== $request->user()->id) {
            return response()->json(["message" => "Unauthorized"], 403);
        }
    
        // Prepare items for insertion
        $items = array_map(function ($item) use ($orderId) {
            return array_merge($item, ['order_id' => $orderId]);
        }, $validatedData['items']);
    
        // Insert items into the database
        Item::insert($items);
    
        return response()->json(["data" => $items, "message" => "Items created successfully"], 201);
    });
    

});
