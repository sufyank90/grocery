<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use App\Notifications\VerifyAccount;
//Order
use App\Models\Order;

Route::middleware(['guest'])->prefix('auth')->group(function () {





    Route::post('/forgetpassword',function(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'string', 'email', 'max:255'],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422); // 422 Unprocessable Entity
        }


         $status = Password::sendResetLink(
           $request->only('email')
         );

         if ($status == Password::RESET_LINK_SENT) {
            $message = "Reset password link sent to your email";
            return response()->json([ "message"=>$message ,"status"=>$status], 200);
        }else{
            $message = "Invalid credentials";
            return response()->json([ "message"=>$message ,"status"=>$status], 401);
        }

    });
    
    

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

        $user = User::where(['email' => $email, 'password' => $password])->first();
        if($user){
            $tokenResult = $user->createToken('Personal Access Token');
            $token = $tokenResult->plainTextToken;
            $message = "Login successfully";
           
            $order = Order::where('user_id', $user->id)->orderBy('id', 'desc')->first();
            $addressData = [];
            
            if ($order) {
                $addressData = [
                    'name' => $order->name,
                    'email' => $order->email,
                    'phone' => $order->phone,
                    'address' => $order->address,
                    'zipcode' => $order->zipcode,
                    'city' => $order->city,
                    'country' => $order->country,
                ];
            }
          

             return response()->json([ "message"=>$message,"token"=> $token , "data"=>$user,'address'=>$addressData] , 200);
        }else{
            $message = "Invalid credentials";
            return response()->json([ "message"=>$message], 401);
        }

    });

    Route::post('/register',function(Request $request){

        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'phone' => ['required', 'string', 'max:20', 'unique:users'],
            'password' => ['required', 'string', Rules\Password::defaults()],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422); // 422 Unprocessable Entity
        }

        $user = User::create($request->all());

        //assign user role
        $user->assignRole('user');

         // Send verification email
        $verificationUrl = route('verification.verify-app', ['id' => $user->id, 'hash' => sha1($user->email)]);
        try{
            $user->notify(new VerifyAccount($verificationUrl));
        }
        catch(Exception $e){
            return response()->json(["data"=>$user,"message"=>"Account Created"], 200);
        }
        return response()->json(["data"=>$user,"message"=>"Account Created"], 200);


    });
    
});

Route::middleware(['auth:sanctum'])->group(function () {


    Route::post('/verifyaccountemail',function(Request $request){
        $user = $request->user();
        $verificationUrl = route('verification.verify-app', ['id' => $user->id, 'hash' => sha1($user->email)]);
        try{
            $user->notify(new VerifyAccount($verificationUrl));
        }
        catch(Exception $e){
            return response()->json(["message"=>"Failed to send verification email"]);
        }
    });

    
    Route::delete('/deleteaccount', function(Request $request) {
        $user = $request->user();
       $user->delete();
        return response()->json(['message' => 'User deleted successfully'], 200); 
    });
   
    Route::post('/changepassword', function(Request $request) {
        $validator = Validator::make($request->all(), [
            'oldpassword' => ['required', 'string'],
            'newpassword' => ['required', 'string', 'min:8'],
        ]);

    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
    
        $user = $request->user();
    
        if (!Hash::check($request->oldpassword, $user->password)) {
            return response()->json(['message' => 'Invalid current password'], 401); 
        }
    
        $user->password = Hash::make($request->newpassword);
        $user->save();
    
        return response()->json(['message' => 'Password changed successfully'], 200); 
    });

    Route::put('/profile', function(Request $request) {
        $user = $request->user();
    
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required', 
                'string', 
                'email', 
                'max:255', 
                Rule::unique('users')->ignore($user->id),
            ],
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
    
        $user->name = $request->name;
        $user->email = $request->email;
        $user->save();
    
        // Delete the current tokens
        $user->tokens()->delete();
    
        // Create a new token
        $tokenResult = $user->createToken('Personal Access Token');
        $token = $tokenResult->plainTextToken;
    
        $message = "Profile updated successfully";
        return response()->json(["message" => $message, "token" => $token, "data" => $user], 200);
    });
});




