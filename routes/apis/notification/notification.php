<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
//DatabaseNotification


Route::middleware('auth:sanctum')->prefix('notification')->group(function () {

    Route::get('',function(Request $request){
        $notifications = Auth::user()->unreadNotifications;
        // You can convert the collection to an array if needed
        $data = $notifications->toArray();
        return response()->json(["data"=>$data,"message"=>"success"], 200);
    });


    Route::post('/read',function(Request $request){
        $id = $request->id;
        $check = Auth::user()->unreadNotifications->find($id);
        if($check) {
            $check->markAsRead();
            return response()->json(["message"=>"Mark as read"], 200);
        }
        return response()->json(["message"=>"No notification found"], 404);
    });


});