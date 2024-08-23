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
        $data = Product::with('categories')->with('media')->orderBy('id','desc')->get();
        return response()->json(["data"=>$data,"message"=>"success"], 200);

    });

    Route::get('/{slug}',function(Request $request,$slug){
        $data = Product::with('categories')->with('media')->where('name','like','%'.$slug.'%')->orderBy('id','desc')->get();
        return response()->json(["data"=>$data,"message"=>"success"], 200);
    });

    Route::get('/category/{category}',function(Request $request,$category){
        // goto category then apply filter
        $data = Product::with('categories')->with('media')->whereHas('categories', function ($q) use ($category) {
            $q->where('name', $category);
        })->orderBy('id','desc')->get();
        return response()->json(["data"=>$data,"message"=>"success"], 200);
    });

    Route::get('/category/{category}/{slug}',function(Request $request,$category,$slug){
        // goto category then apply filter
        $data = Product::with('categories')->with('media')->where('name','like','%'.$slug.'%')->whereHas('categories', function ($q) use ($category) {
            $q->where('name', $category);
        })->orderBy('id','desc')->get();
        return response()->json(["data"=>$data,"message"=>"success"], 200);
    });

});