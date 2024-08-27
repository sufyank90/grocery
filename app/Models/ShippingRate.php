<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingRate extends Model
{

    use HasFactory;

    public function products(){
        return $this->belongsToMany(Product::class, 'product_shipping_rate', 'product_id', 'shipping_rate_id');
    }
}
