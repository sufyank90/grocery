<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'type', 'value', 'usage_type', 'usage_limit', 'expiry_date'
    ];

    public function isExpired()
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }

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
}
