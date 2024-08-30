<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

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
    protected $casts = [
        'created_at' => 'datetime',
    ];

   

    protected static function boot()
    {
        parent::boot();

        // Format created_at when retrieving from the database
        static::retrieved(function ($model) {
            if ($model->created_at) {
                $model->created_at_formatted = $model->created_at->format('j/M/Y g:i A');
            }
        });
    }
/**
     * Get the items for the order.
     */
    public function items()
    {
        return $this->hasMany(Item::class);
    }

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class, 'order_id');
    }
}