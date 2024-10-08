<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Variation extends Model
{
    use HasFactory;


    protected $fillable = [
        'product_id', 'attributes', 'sale_price', 'regular_price', 'sku', 'status', 'stock_count'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
