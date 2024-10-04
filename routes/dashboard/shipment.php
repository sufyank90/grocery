<?php


use App\Http\Controllers\ShippingRateController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->prefix('dashboard')->group(function () {
     Route::resource('shipment', ShippingRateController::class); 
     Route::post('/shipment/bulkdestroy', [ShippingRateController::class, 'bulkdestroy'])->name('shipment.bulkdestroy');
});
