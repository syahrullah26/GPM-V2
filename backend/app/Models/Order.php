<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Customer;
use App\Models\Quotation;
use App\Models\OrderItem;
use App\Models\Invoice;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';
    protected $fillable = [
        'order_number',
        'quotation_id',
        'order_date',
        'customer_id',
        'status',
    ];

    protected $casts = [
        'order_date' => 'date'
    ];

    public function customers()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function quotations()
    {
        return $this->belongsTo(Quotation::class, 'quotation_id');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
    public function invoices()
    {
        return $this->hasOne(Invoice::class);
    }
    public function deliveryNote()
    {
        return $this->hasOne(DeliveryNote::class);
    }
}
