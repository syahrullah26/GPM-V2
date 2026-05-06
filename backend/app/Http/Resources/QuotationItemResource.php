<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuotationItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'quotation_id' => $this->quotation_id,
            'item_name' => $this->item_name,
            'quantity' => $this->quantity,
            'unit' => $this->unit,
            'price' => $this->price,
            'cost_price' => $this->cost_price,
            'subtotal' => $this->quantity * $this->price,
            'formatted_price' => 'Rp ' . number_format($this->price, 0, ',', '.'),
            'formatted_cost_price' => 'Rp ' . number_format($this->cost_price, 0, ',', '.'),
            'formatted_subtotal' => 'Rp ' . number_format($this->quantity * $this->price, 0, ',', '.'),
        ];
    }
}
