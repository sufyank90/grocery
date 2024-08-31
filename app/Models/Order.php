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

    protected $appends = ['created_at_formatted'];
   

    public function getCreatedAtFormattedAttribute()
    {
        return $this->created_at ? Carbon::parse($this->created_at)->format('d/M/Y h:i A') : null;
    }

    protected static function boot()
    {
        parent::boot();
        // No need to add any additional logic in the boot method
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