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
        Schema::table('products', function (Blueprint $table) {
            $table->string('sku')->nullable();
            $table->string('sale_price')->nullable();
            $table->integer('regular_price')->nullable();
            $table->string('tax_class')->nullable();
            $table->integer('tax')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('sku');
            $table->dropColumn('sale_price');
            $table->dropColumn('regular_price');
            $table->dropColumn('tax_class');
            $table->dropColumn('tax');
        });
    }
};
