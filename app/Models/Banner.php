<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
class Banner extends Model implements HasMedia
{
    use HasFactory,InteractsWithMedia;
    protected $fillable = [
        'category_id',
        'product_id',
    ];
<<<<<<< HEAD

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
=======
     // Define the relationship with Category
     public function category()
     {
         return $this->belongsTo(Category::class, 'category_id');
     }
>>>>>>> 29fdd75113e8b3c06b28724570de631ca9c6bdf4
}
