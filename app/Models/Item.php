<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'name',
        'category',
        'price',
        'qty',
        'status',
        'order_id',
        'variation_id'
    ];

    /**
     * Get the order that owns the item.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function variation()
    {
        return $this->belongsTo(Variation::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    
}
