<?php namespace App\Modules\Transaction\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model {

	protected $table   = 'transactions';

    public function Category()
    {
        return $this->belongsTo('App\Modules\Transaction\Models\Category');
    }

    public function TransactionDetails()
    {
        return $this->hasMany('App\Modules\Transaction\Models\TransactionDetail');
    }

}
