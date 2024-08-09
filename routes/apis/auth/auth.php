<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

Route::middleware(['guest'])->prefix('auth')->group(function () {


    Route::post('/login',function(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422); // 422 Unprocessable Entity
        }

        $email = $request->email;
        $password = $request->password;

        $checkuser = Auth::attempt(['email' => $email, 'password' => $password]);
        if($checkuser){
            $user = $request->user();
            $tokenResult = $user->createToken('Personal Access Token');
            $token = $tokenResult->plainTextToken;
            
            $message = "Login successfully";
             return response()->json([ "message"=>$message,"token"=> $token , "data"=>$user] , 200);
        }else{
            $message = "Invalid credentials";
            return response()->json([ "message"=>$message], 401);
        }

    });

    Route::post('/register',function(Request $request){

        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', Rules\Password::defaults()],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422); // 422 Unprocessable Entity
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->string('password')),
        ]);
    
        return response()->json(["data"=>$user,"message"=>"Account Created"], 200);


    });

});