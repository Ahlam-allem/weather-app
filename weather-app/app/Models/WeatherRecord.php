<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WeatherRecord extends Model
{
    protected $fillable = [
        'city_name',
        'temperature',
        'weather_description',
        'fetched_at'
    ];

    protected $casts = [
        'fetched_at' => 'datetime',
    ];
}