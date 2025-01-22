<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('weather_records', function (Blueprint $table) {
            $table->id();
            $table->string('city_name');
            $table->decimal('temperature', 5, 2);
            $table->string('weather_description');
            $table->timestamp('fetched_at');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('weather_records');
    }
};