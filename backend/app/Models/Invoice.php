<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Order;

class Invoice extends Model
{
    use HasFactory;
    protected $table = 'invoices';
    protected $fillable = [
        'order_id',
        'invoice_number',
        'subtotal',
        'is_taxable',
        'tax_rate',
        'tax_amount',
        'grand_total',
        'due_date',
        'status',
    ];

    protected $casts = [
        'due_date' => 'date'
    ];

    public function orders()
    {
        return $this->belongsTo(Order::class,'order_id');
    }
    public function customers()
    {
        return $this->orders->customer();
    }
}
