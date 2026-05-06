<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Order;

class DeliveryNote extends Model
{
    use HasFactory;
    protected $table = 'delivery_notes';
    protected $fillable = [
        'delivery_number',
        'order_id',
        'shipping_date',
    ];

    protected $casts = [
        'shipping_date' => 'date',
    ];

    public function orders()
    {
        return $this->belongsTo(Order::class,'order_id');
    }
}
