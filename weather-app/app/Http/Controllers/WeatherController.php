<?php

namespace App\Http\Controllers;

use App\Models\WeatherRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class WeatherController extends Controller
{
    // Cache timeout duration in seconds (5 minutes)
    private $cacheTimeout = 300;
    private $apiKey;

    public function __construct()
    {
        // Get API key from configuration
        $this->apiKey = config('services.weather.key');
    }

    /**
     * Fetch weather data for a given city
     * Implements caching to reduce API calls
     */
    public function getWeather(Request $request)
    {
        // Validate incoming request
        $validator = Validator::make($request->all(), [
            'city' => 'required|string|min:2|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid city name',
                'errors' => $validator->errors()
            ], 422);
        }

        $city = $request->city;

        // Check if weather data exists in cache
        $cacheKey = 'weather_' . strtolower($city);
        if (Cache::has($cacheKey)) {
            return response()->json([
                'status' => 'success',
                'data' => Cache::get($cacheKey),
                'source' => 'cache'
            ]);
        }

        try {
            // Fetch fresh data from Weather API
            $response = Http::get('http://api.weatherapi.com/v1/current.json', [
                'key' => $this->apiKey,
                'q' => $city,
                'aqi' => 'no'
            ]);

            if ($response->successful()) {
                $weatherData = $response->json();
                
                // Save weather data to database
                $record = WeatherRecord::create([
                    'city_name' => $weatherData['location']['name'],
                    'temperature' => $weatherData['current']['temp_c'],
                    'weather_description' => $weatherData['current']['condition']['text'],
                    'fetched_at' => now(),
                ]);

                // Cache the result
                Cache::put($cacheKey, $record, $this->cacheTimeout);

                return response()->json([
                    'status' => 'success',
                    'data' => $record,
                    'source' => 'api'
                ]);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch weather data'
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while fetching weather data',
                'debug' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Retrieve weather search history
     * Returns the most recent searches
     */
    public function getHistory()
    {
        try {
            $records = WeatherRecord::orderBy('created_at', 'desc')
                ->take(10)
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $records
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch weather history'
            ], 500);
        }
    }
}