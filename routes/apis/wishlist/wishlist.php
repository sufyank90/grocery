<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Wishlist;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;

Route::middleware('auth:sanctum')->prefix('wishlist')->group(function () {

    Route::get('', function (Request $request) {
        $user = $request->user();
        $wishlist = Wishlist::where('user_id', $user->id)->with('product','product.media','product.categories')
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

        if(Wishlist::where('user_id', $user->id)->where('product_id', $validatedData['product_id'])->exists()){
            //remove the product from wishlist
            $wishlist = Wishlist::where('user_id', $user->id)->where('product_id', $validatedData['product_id'])->first();
            $wishlist->delete();
            return response()->json(["data" => $wishlist, "message" => "Removed from Wishlist successfully"], 200);
        }

        $wishlist = Wishlist::create(array_merge($validatedData, [
            'user_id' => $user->id,
        ]));


        return response()->json(["data" => $wishlist, "message" => "Added to Wishlist successfully"], 201);
    });

    // Delete all wishlist
    Route::delete('', function (Request $request) {
        $user = $request->user();
        $wishlist = Wishlist::where('user_id', $user->id)->delete();
        return response()->json(["data" => $wishlist, "message" => "Cleared all wishlist successfully"], 200);
    });

});
