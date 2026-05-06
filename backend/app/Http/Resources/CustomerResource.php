<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
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
            'company_name' => $this->company_name,
            'pic_name' => $this->pic_name,
            'contact' => [
                'address' => $this->address,
                'phone' => $this->phone,
            ],
            'quotations' => QuotationResource::collection($this->whenLoaded('quotations')),
            'orders' => OrderResource::collection($this->whenLoaded('orders')),
        ];
    }
}
