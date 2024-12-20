<?php

return [
    'username' => env('MEZPAY_USERNAME', ''),
    'password' => env('MEZPAY_PASSWORD', ''),
    'success_callback' => env('MEZPAY_SUCCESS_CALLBACK', env('APP_URL') . '/order_payment/success'),
    'failed_callback' => env('MEZPAY_FAILED_CALLBACK', env('APP_URL') . '/order_payment/failed'),
];

