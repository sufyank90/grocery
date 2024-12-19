<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OrderController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    Route::resource('order', OrderController::class);
    Route::put('order/status/{id}', [OrderController::class, 'status'])->name('order.status');
    Route::post('/order/bulkdestroy', [OrderController::class, 'bulkdestroy'])->name('order.bulkdestroy');

    Route::get('order_payment/success/{orderId?}', [OrderController::class, 'orderSucceeded'])->name('success');
    Route::get('order_payment/failed/{orderId?}', [OrderController::class, 'orderFailed'])->name('failed');
    
    Route::get('order_payment/register', [OrderController::class, 'registerOrder'])->name('registerOrder');

});
