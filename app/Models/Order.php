<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'zipcode',
        'city',
        'country',
        'method',
        'total',
        'couponcode',
        'coupontype',
        'discount',
        'status',
        'payable',
        'user_id',
    ];

/**
     * Get the items for the order.
     */
    public function items()
    {
        return $this->hasMany(Item::class);
    
}
}