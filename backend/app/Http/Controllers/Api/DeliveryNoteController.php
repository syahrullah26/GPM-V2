<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DeliveryNoteRequest;
use App\Models\DeliveryNote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\DeliveryNoteResource;
use Illuminate\Http\JsonResponse;


class DeliveryNoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $data = DeliveryNote::latest()->with('orders', 'orders.invoices')->paginate(10);
            return response()->json([
                'status' => true,
                'message' => 'Fetch Delivery Notes Successfully',
                'data' => DeliveryNoteResource::collection($data)->response()->getData(true),
            ], 200);
        } catch (\Exception $e) {
            Log::error("Delivery Note Fetch Error: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Internal Server Error :' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(DeliveryNoteRequest $request): JsonResponse
    {
        return DB::transaction(function () use ($request) {
            try {
                $validated = $request->validated();
                $deliveryNote = DeliveryNote::create([
                    'order_id' => $validated['order_id'],
                    'delivery_number' => $validated['delivery_number'],
                    'shipping_date' => $validated['shipping_date'],
                ]);

                return response()->json([
                    'status' => true,
                    'message' => 'Add Delivery Note Successfully',
                    'data' => new DeliveryNoteResource($deliveryNote),
                ], 201);
            } catch (\Exception $e) {
                Log::error("Delivery Note Store Error: " . $e->getMessage());
                return response()->json([
                    'status' => false,
                    'message' => 'Internal Server Error :' . $e->getMessage(),
                ], 500);
            }
        });
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
        //
    }
}
