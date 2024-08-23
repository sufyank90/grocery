<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

Route::middleware('auth:sanctum')->prefix('category')->group(function () {


    Route::get('',function(Request $request){
        $data = Category::orderBy('id','desc')->with('media')->get();
        return response()->json(["data"=>$data,"message"=>"success"], 200);

    });

});