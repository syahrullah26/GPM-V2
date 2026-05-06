<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'        => (string) $this->id,
            'order_id'  => (string) $this->order_id,
            'item_name' => $this->item_name,
            'quantity'  => (string) $this->quantity,
            'unit'      => $this->unit,
            'price' => [
                'selling_price' => (string) $this->selling_price,
                'cost_price'    => (string) $this->cost_price,
                'formatted_selling_price' => 'Rp ' . number_format($this->selling_price, 0, ',', '.'),
            ],
            'subtotal' => (string) ($this->quantity * $this->selling_price),
            'formatted_subtotal' => 'Rp ' . number_format($this->quantity * $this->selling_price, 0, ',', '.'),
        ];
    }
}
