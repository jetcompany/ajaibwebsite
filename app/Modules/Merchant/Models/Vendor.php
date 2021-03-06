<?php

namespace App\Modules\Merchant\Models;

use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    protected $fillable  = ['name'];
    public function category()
    {
        return $this->belongsTo('App\Modules\Merchant\Models\VendorCategory', 'category_id');
    }

    public function transactions()
    {
        return $this->hasMany('App\Modules\Transaction\Models\Transaction');
    }
}
