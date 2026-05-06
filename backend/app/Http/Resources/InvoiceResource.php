<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
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
            'order_id' => $this->order_id,
            'invoice_number' => $this->invoice_number,
            'subtotal' => $this->subtotal,
            'formated_subtotal' => 'Rp ' . number_format($this->subtotal, 0, ',', '.'),
            'is_taxable' => $this->is_taxable,
            'tax_rate' => $this->tax_rate,
            'formated_tax_rate' => $this->tax_rate . '%',
            'tax_amount' => $this->tax_amount,
            'formated_tax_amount' => 'Rp ' . number_format($this->tax_amount, 0, ',', '.'),
            'grand_total' => $this->grand_total,
            'formated_grand_total' => 'Rp ' . number_format($this->grand_total, 0, ',', '.'),
            'due_date' => $this->due_date->format('d m Y'),
            'status' => $this->status,
            'orders' => OrderResource::collection($this->whenLoaded('orders')),
            
        ];
    }
}
