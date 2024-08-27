<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Wishlist;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;

Route::middleware('auth:sanctum')->prefix('wishlist')->group(function () {

    Route::get('', function (Request $request) {
        $user = $request->user();
        $wishlist = Wishlist::where('user_id', $user->id)->with('product','product.media')
            ->orderBy('id', 'desc')
            ->get();
        
        return response()->json(["data" => $wishlist, "message" => "success"], 200);
    });

    Route::post('', function (Request $request) {
        // Validate the incoming request data
        $validator = Validator::make($request->all(), [

                'product_id' => 'required',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors(), 422);
        }
        

        $validatedData = $validator->validated();

        // Get the currently authenticated user
        $user = $request->user();

        // Create a new order with the validated data
        $wishlist = Wishlist::create(array_merge($validatedData, [
            'user_id' => $user->id,
        ]));


        return response()->json(["data" => $wishlist, "message" => "Wishlist created successfully"], 201);
    });

});
