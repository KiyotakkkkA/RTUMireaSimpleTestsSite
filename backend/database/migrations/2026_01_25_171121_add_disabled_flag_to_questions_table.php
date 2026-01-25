<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->integer('disabled')->default(0)->after('options');
        });
        Schema::table('tests', function (Blueprint $table) {
            $table->integer('total_disabled')->default(0)->after('total_questions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn('disabled');
        });
        Schema::table('tests', function (Blueprint $table) {
            $table->dropColumn('total_disabled');
        });
    }
};
