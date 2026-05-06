<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Quotation;

class QuotationItem extends Model
{
    use HasFactory;
    protected $table = 'quotation_items';
    protected $fillable = [
        'quotation_id',
        'item_name',
        'quantity',
        'unit',
        'price',
        'cost_price',
    ];

    public function quotation()
    {
        return $this->belongsTo(Quotation::class, 'quotation_id');
    }
}
