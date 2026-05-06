<?php

use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\QuotationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('test')->group(function () {
    Route::get('/health', function () {
        return response()->json(['status' => 'ok', 'message' => 'Api Succesfully runnign']);
    });
    Route::apiResource('customers', CustomerController::class);
    Route::apiResource('orders', OrderController::class);
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);

    Route::patch('/quotations/{id}/reject', [QuotationController::class, 'rejectStatus']);
    Route::post('/quotations/{id}/approve', [QuotationController::class, 'approveStatus']);
    Route::apiResource('quotations', QuotationController::class);
});



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
