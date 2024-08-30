<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Feedback;
use App\Models\Order;
use Illuminate\Support\Facades\Validator;

Route::middleware('auth:sanctum')->prefix('feedback')->group(function () {

    // Get all feedbacks for the authenticated user
    Route::get('', function (Request $request) {
        $user = $request->user();

        $feedbacks = Feedback::where('user_id', $user->id)
            ->with('order') // Optionally, include the related order data
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(["data" => $feedbacks, "message" => "success"], 200);
    });

    // Submit a new feedback
    Route::post('', function (Request $request) {
        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validatedData = $validator->validated();

        // Get the currently authenticated user
        $user = $request->user();

        // Create a new feedback with the validated data
        $feedback = Feedback::create(array_merge($validatedData, [
            'user_id' => $user->id,
        ]));

        return response()->json(["data" => $feedback, "message" => "Feedback submitted successfully"], 201);
    });

});
