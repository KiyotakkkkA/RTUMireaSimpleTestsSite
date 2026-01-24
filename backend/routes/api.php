<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuditController;
use App\Http\Controllers\TestsController;
use App\Http\Controllers\StatisticsController;
use App\Http\Controllers\QuestionFilesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('/login', [AuthController::class, 'login'])->name('auth.login');
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me'])->name('auth.me');
        Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
    });
});

// Admin routes
Route::middleware(['auth:sanctum', 'permission:view admin panel'])->prefix('admin')->group(function () {
    Route::get('/roles', [AdminController::class, 'roles'])->name('admin.roles');
    Route::get('/permissions', [AdminController::class, 'permissions'])->name('admin.permissions');

    Route::get('/audit', [AuditController::class, 'index'])->name('admin.audit')->middleware('permission:view audit logs');

    Route::group(['prefix' => 'users'], function () {
        Route::get('/', [AdminController::class, 'index'])->name('admin.users');
        Route::post('/', [AdminController::class, 'store'])->name('admin.users.store');
        Route::patch('/{user}/roles', [AdminController::class, 'updateRoles'])->name('admin.users.roles');
        Route::patch('/{user}/permissions', [AdminController::class, 'updatePermissions'])->name('admin.users.permissions');
        Route::delete('/{user}', [AdminController::class, 'destroy'])->name('admin.users.delete');
    });

    Route::group(['prefix' => 'statistics'], function () {
        Route::get('/', [AdminController::class, 'statistics'])->name('admin.statistics')->middleware('permission:view statistics');
    });
});

// Workbench routes for test creation and editing
Route::middleware('auth:sanctum')->prefix('workbench')->group(function () {

    Route::group(['prefix' => 'tests'], function () {
        Route::post('/', [TestsController::class, 'createBlankTest'])->middleware('permission:create tests')->name('workbench.tests.store');
        Route::get('/{testId}', [TestsController::class, 'show'])->middleware('permission:edit tests')->name('workbench.tests.show');
        Route::put('/{testId}', [TestsController::class, 'update'])->middleware('permission:edit tests')->name('workbench.tests.update');
        Route::post('/{testId}/auto-fill', [TestsController::class, 'autoFill'])->middleware('permission:edit tests')->name('workbench.tests.auto_fill');
        Route::delete('/{testId}', [TestsController::class, 'destroy'])->middleware('permission:delete tests')->name('workbench.tests.delete');
    });

    Route::group(['prefix' => 'questions'], function () {
        Route::post('/{questionId}/files', [QuestionFilesController::class, 'store'])->middleware('permission:edit tests')->name('workbench.questions.files.store');
        Route::delete('/{questionId}/files/{fileId}', [QuestionFilesController::class, 'destroy'])->middleware('permission:edit tests')->name('workbench.questions.files.delete');
    });
});

Route::get('/tests', [TestsController::class, 'index'])->name('tests.index');
Route::get('/tests/{testId}', [TestsController::class, 'publicShow'])->name('tests.show');

Route::post('/statistics/test', [StatisticsController::class, 'saveTetsCompletionStatistics'])->name('statistics.test.completion');