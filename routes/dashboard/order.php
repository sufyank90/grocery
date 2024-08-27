<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OrderController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    Route::resource('order', OrderController::class);
    Route::put('order/status/{id}', [OrderController::class, 'status'])->name('order.status');

});
