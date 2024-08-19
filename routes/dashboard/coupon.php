<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CouponController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    Route::resource('coupon', CouponController::class);    
});
