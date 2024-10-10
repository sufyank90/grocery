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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->longText('address');
            $table->string('zipcode',10)->nullable();
            $table->string('city');
            $table->string('country');
            $table->enum('method',['cash','card'])->default('cash');
            $table->decimal('total', 10, 2);
            $table->string('couponcode',50)->nullable();
            $table->enum('coupontype',['fixed','percent'])->nullable();
            $table->decimal('discount', 10, 2)->nullable();
            $table->string('status')->default('pending');
            $table->decimal('payable', 10, 2);
            $table->unsignedBigInteger('user_id')->nullable(); // Foreign key column
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
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
        Schema::dropIfExists('orders');
    }
};
