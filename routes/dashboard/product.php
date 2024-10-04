<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    Route::resource('product', ProductController::class); 
    Route::post('/product/updatewithfile/{product}', [ProductController::class, 'updatewithfile'])->name('product.updatewithfile');  
    Route::put('product/status/{id}', [ProductController::class, 'status'])->name('product.status');
    Route::post('/product/csvstore', [ProductController::class, 'csvstore'])->name('product.csvstore');
    Route::get('/csvexport', [ProductController::class, 'csvExport'])->name('product.csvexport');
    Route::post('/product/bulkdestroy', [ProductController::class, 'bulkdestroy'])->name('product.bulkdestroy');
});
