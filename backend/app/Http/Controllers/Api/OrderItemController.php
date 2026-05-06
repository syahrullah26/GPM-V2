<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use App\Models\OrderItem;

class OrderItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return DB::transaction(function () use ($id) {
            try {
                $item = OrderItem::findOrFail($id);
                $order = $item->order;
                $item = $item->delete();
                $subtotal = $order->orderItems()->sum(DB::raw('quantity * selling_price'));

                $invoice = $order->invoices;

                $taxRate = $invoice->is_taxable ? $invoice->tax_rate : 0;
                $taxAmount = ($subtotal * $taxRate) / 100;
                $grandTotal = $subtotal + $taxAmount;

                $invoice->update([
                    'subtotal'   => $subtotal,
                    'tax_amount' => $taxAmount,
                    'grand_total' => $grandTotal,
                ]);

                return response()->json([
                    'status' => true,
                    'message' => 'Item deleted and invoice updated',
                    'data' => [
                        'new_subtotal' => $subtotal,
                        'new_grand_total' => $grandTotal
                    ]
                ]);
            } catch (ModelNotFoundException $e) {
                return response()->json([
                    'status' => false,
                    'message' => 'Order Item Not Found'
                ], 404);
            } catch (\Exception $e) {
                Log::error('Error on delete item : ' . $e->getMessage());
                return response()->json([
                    'status' => false,
                    'message' => 'Internal Server Error' . $e->getMessage(),

                ], 500);
            }
        });
    }
}
