<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


include __DIR__ . '/apis/auth/auth.php';
include __DIR__ . '/apis/category/getcategory.php';
include __DIR__ . '/apis/product/getproduct.php';
include __DIR__ . '/apis/order/order.php';
include __DIR__ . '/apis/item/item.php';
include __DIR__ . '/apis/coupon/getcoupon.php';
include __DIR__ . '/apis/shippingrate/getshippingrate.php';
include __DIR__ . '/apis/banner/getbanner.php';