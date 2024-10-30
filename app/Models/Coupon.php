<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'type', 'value', 'usage_type', 'usage_limit', 'expiry_date','min_amount','limit'
    ];

    public function isExpired()
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }

    

    // protected $casts = [
    //     'expiry_date' => 'date',
    // ];

    public function canBeUsed()
    {
        if ($this->isExpired()) {
            return false;
        }

        if ($this->usage_type === 'single' && $this->usage_limit === 0) {
            return false;
        }

        if ($this->usage_type === 'multiple' && $this->usage_limit <= 0) {
            return false;
        }

        return true;
    }
    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
