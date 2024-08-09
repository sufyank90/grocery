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
        Schema::create('category_product', function (Blueprint $table) {
            $table->bigInteger('category_id')->unsigned(); // Make sure to use unsigned for foreign keys
            $table->bigInteger('product_id')->unsigned(); // Make sure to use unsigned for foreign keys

            // Define foreign key constraints
            $table->foreign('category_id')
                  ->references('id')->on('categories')
                  ->onDelete('cascade'); // Optional: define action on delete

            $table->foreign('product_id')
                  ->references('id')->on('products')
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
        Schema::dropIfExists('category_product');
    }
};
