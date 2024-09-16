<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Setting; // Import the Setting model

Route::middleware(['auth:sanctum'])->group(function () {

    Route::post('/redeem', function(Request $request) {
        // Validate the request to ensure 'coins' is provided and is an integer
        $validator = Validator::make($request->all(), [
            'coins' => ['required', 'integer', 'min:1'], // Ensure at least 1 coin is provided
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422); // 422 Unprocessable Entity
        }

        $user = $request->user();
        $coinsToRedeem = $request->coins; // Get the number of coins from the request

        // Fetch the conversion rate from settings where id is 6
        $setting = Setting::find(6);

        // Check if the setting exists
        if (!$setting) {
            return response()->json(['message' => 'Conversion rate setting not found'], 500); // 500 Internal Server Error
        }

        // Get the conversion rate and ensure it is a valid number
        $conversionRate = (int) $setting->value;
        if ($conversionRate <= 0) {
            return response()->json(['message' => 'Invalid conversion rate'], 500); // 500 Internal Server Error
        }

        // Check if user has enough coins
        if ($coinsToRedeem > $user->earn_rewards) {
            return response()->json(['message' => 'Insufficient coins'], 400); // 400 Bad Request
        }

        // Calculate redeemable amount
        $redeemableAmount = $coinsToRedeem / $conversionRate;
        
        // Update user data
        $user->wallet += $redeemableAmount; // Add the converted amount to wallet
        $user->redeem_rewards += $coinsToRedeem; // Add the coins to redeem_rewards
        $user->earn_rewards -= $coinsToRedeem; // Deduct the coins from earn_rewards
        $user->save();

        return response()->json([
            'data' => $user,
            'message' => 'Coins converted to wallet and earn_rewards updated successfully'
        ], 200);
    });
});
