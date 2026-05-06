<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\QuotationItem;
use App\Models\Order;
use App\Models\Customer;

class Quotation extends Model
{
    use HasFactory;

    protected $table = 'quotations';
    protected $fillable = [
        'quotation_number',
        'customer_id',
        'date',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function customers()
    {
        return $this->belongsTo(Customer::class,'customer_id');
    }
    public function quotationItems()
    {
        return $this->hasMany(QuotationItem::class);
    }

    public function orders()
    {
        return $this->hasOne(Order::class);
    }
}
