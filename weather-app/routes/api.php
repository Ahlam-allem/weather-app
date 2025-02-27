<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WeatherController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::post('/weather', [WeatherController::class, 'getWeather']);
Route::get('/weather/history', [WeatherController::class, 'getHistory']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
