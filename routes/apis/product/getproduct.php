<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

Route::middleware('auth:sanctum')->prefix('product')->group(function () {


    Route::get('',function(Request $request){
        $data = Product::with('categories')->orderBy('id','desc')->get();
        return response()->json(["data"=>$data,"message"=>"success"], 200);

    });

});