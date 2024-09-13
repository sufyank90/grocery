<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;


class Product extends Model implements HasMedia
{
    use HasFactory,InteractsWithMedia;

    protected $fillable = [
        'name','description','price','status','sku','sale_price','regular_price','tax_class','tax','stock_count'
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_product', 'product_id', 'category_id');
    }

    public function shipping_rates(){
        return $this->belongsToMany(ShippingRate::class, 'product_shipping_rate', 'product_id', 'shipping_rate_id');
    }

    public function attributeValues()
    {
        return $this->belongsToMany(Attributevalue::class, 'attributevalue_product', 'product_id', 'attributevalue_id');
    }
    
}
