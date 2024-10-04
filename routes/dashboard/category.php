<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    Route::resource('category', CategoryController::class);   
    Route::post('/category/updatewithfile/{category}', [CategoryController::class, 'updatewithfile'])->name('category.updatewithfile'); 
    // /bulkdestroy
    Route::post('/category/bulkdestroy', [CategoryController::class, 'bulkdestroy'])->name('category.bulkdestroy');

});
