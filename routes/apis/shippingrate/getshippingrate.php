<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\ShippingRate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

Route::middleware('auth:sanctum')->prefix('shippingrate')->group(function () {


    Route::get('/{country}/{state}',function(Request $request,$country,$state){
        // goto category then apply filter
        $data = ShippingRate::where('country_name','like','%'.$country.'%')->where('city_name','like','%'.$state.'%')->get();
        return response()->json(["data"=>$data,"message"=>"success"], 200);
    });


});