<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Invoice;

class UpdateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $orderId = $this->route('id');
        $invoiceId = Invoice::where('order_id', $orderId)->value('id');
        return [

            'order_number' => [
                'required',
                'string',
                Rule::unique('orders', 'order_number')->ignore($orderId)
            ],
            'quotation_id' => 'nullable|exists:quotations,id',
            'customer_id'  => 'required|exists:customers,id',
            'order_date'         => 'required|date',
            'status'       => 'required|string',

            'items'                  => 'required|array|min:1',
            'items.*.id'             => 'nullable|exists:order_items,id',
            'items.*.item_name'      => 'required|string|max:255',
            'items.*.quantity'       => 'required|integer|min:1',
            'items.*.unit'           => 'nullable|string',
            'items.*.selling_price'  => 'required|numeric|min:0',
            'items.*.cost_price'     => 'required|numeric|min:0',

            'invoice_number' => [
                'nullable',
                'string',
                Rule::unique('invoices', 'invoice_number')->ignore($invoiceId)
            ],
            'is_taxable'     => 'required|boolean',
        ];
    }


    public function messages(): array
    {
        return [
            'order_number.unique' => 'Nomor order sudah terdaftar di sistem.',
            'items.required' => 'Minimal harus ada satu item dalam order.',
            'items.*.item_name.required' => 'Nama item tidak boleh kosong.',
            'items.*.quantity.min' => 'Jumlah barang minimal 1.',
        ];
    }
}
