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
        Schema::create('variations', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('product_id')->unsigned();
            $table->foreign('product_id')
            ->references('id')->on('products')
            ->onDelete('cascade');

            $table->json('attributes');

            $table->string('sale_price')->nullable();
            $table->integer('regular_price')->nullable();

            $table->string('sku')->nullable();

            $table->enum('status' , ['instock' , 'outofstock'])->default('instock');

            $table->integer('stock_count')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('variations');
    }
};
