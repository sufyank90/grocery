<?php


use App\Http\Controllers\ShippingRateController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    Route::resource('shipment', ShippingRateController::class); 
    //Route::get('/shipment', [ShippingRateController::class, 'index'])->name('settings.index');
    //Route::post('/shipment', [ShippingRateController::class, 'update'])->name('settings.update');
});
