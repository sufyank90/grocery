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
        Schema::create('order_shipping_rate', function (Blueprint $table) {
            $table->bigInteger('shipping_rate_id')->unsigned();
            $table->bigInteger('order_id')->unsigned();

            $table->foreign('shipping_rate_id')
                  ->references('id')->on('shipping_rates')
                  ->onDelete('cascade');

            $table->foreign('order_id')
                  ->references('id')->on('orders')
                  ->onDelete('cascade');
        });
    }

    
   
    

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('order_shipping_rate');
    }
};
