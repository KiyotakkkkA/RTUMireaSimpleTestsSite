<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tests', function (Blueprint $table) {
            $table->dateTime('access_from')->nullable()->after('access_link');
            $table->dateTime('access_to')->nullable()->after('access_from');
            $table->enum('access_status', ['all', 'auth', 'custom', 'protected', 'link'])
                ->default('all')
                ->change();
        });

        DB::table('tests')
            ->whereIn('access_status', ['protected', 'link'])
            ->update(['access_status' => 'custom']);
        
        Schema::table('tests', function (Blueprint $table) {
            $table->enum('access_status', ['all', 'auth', 'custom'])
                ->default('all')
                ->change();
        });
    }

    public function down(): void
    {
        Schema::table('tests', function (Blueprint $table) {
            $table->dropColumn(['access_from', 'access_to']);
            $table->enum('access_status', ['all', 'auth', 'protected', 'link'])
                ->default('all')
                ->change();
        });
    }
};
