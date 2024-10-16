<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Banner;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

Route::middleware('auth:sanctum')->prefix('banner')->group(function () {


    // Route::get('',function(Request $request){
    //     $data = Banner::orderBy('id','desc')->with('media')->get();
    //     return response()->json(["data"=>$data,"message"=>"success"], 200);
    // });
    Route::get('', function(Request $request) {
        $data = Banner::orderBy('id', 'desc')
                    ->with(['media', 'category', 'product','product.media','product.categories']) // Load the category with the banner
                    ->get();
        
        $user = $request->user();
        $checkemailverified = $user->hasVerifiedEmail();
        
        return response()->json(["data" => $data, "message" => "success",'verified'=>$checkemailverified], 200);
    });
    

});