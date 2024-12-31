<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    Route::resource('customer', UserController::class); 
    Route::put('customer/wallet/{id}', [UserController::class, 'updateWallet'])->name('customer.wallet');     
    Route::post('/customer/bulkdestroy', [UserController::class, 'bulkdestroy'])->name('customer.bulkdestroy');
    Route::put('/customer/verify/{id}', [UserController::class, 'verify'])->name('customer.verify');
    Route::get('/customer/csv/csvexport', [UserController::class, 'csvExport'])->name('customer.csvexport');

    

});
