<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shipping_rates', function (Blueprint $table) {
            $table->id();
            $table->string('rate_id');
            $table->string('zone_id');
            $table->string('weight_status');
            $table->string('merchant_id');
            $table->string('country_id');
            $table->string('country_name');
            $table->string('state_id');
            $table->string('state_name');
            $table->string('city_id');
            $table->string('city_name');
            $table->string('postal_code');
            $table->string('area_id');
            $table->string('branch_id');
            $table->string('area_name');
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();
            $table->decimal('fee', 10, 5);
            $table->decimal('minimum', 10, 2);
            $table->decimal('min_for_free_delivery', 10, 2);
            $table->integer('delivery_estimation');
            $table->integer('sequence');
            $table->string('date_created');
            $table->string('date_modified');
            $table->ipAddress('ip_address')->nullable();
            $table->decimal('weight_charges', 10, 2);
            $table->decimal('additional_weight_charges', 10, 2);
            $table->decimal('end_weight_range', 10, 2);

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('shipping_rates');
    }
};
