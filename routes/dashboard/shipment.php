<?php


use App\Http\Controllers\ShippingRateController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    // Route::resource('shipment', ShippingRateController::class); 
    Route::get('/shipment', [ShippingRateController::class, 'index'])->name('shipment.index');
    Route::post('/shipments/{id}', [ShippingRateController::class, 'update'])->name('shipment.feeupdate');
    //create route
    Route::post('/shipment/store', [ShippingRateController::class, 'storeCreate'])->name('shipment.store');
});
