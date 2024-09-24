<?php

use App\Http\Controllers\AttributevalueController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    Route::resource('attributevalue', AttributevalueController::class); 
 
});
