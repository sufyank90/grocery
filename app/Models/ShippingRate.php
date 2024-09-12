<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingRate extends Model
{

    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'fee',
    ];

    public function products(){
        return $this->belongsToMany(Product::class, 'product_shipping_rate', 'product_id', 'shipping_rate_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'shipping_id');
    }
    
    
    
}
