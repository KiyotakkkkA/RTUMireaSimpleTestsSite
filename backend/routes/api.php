<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuditController;
use App\Http\Controllers\TestsController;
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

Route::middleware(['auth:sanctum', 'permission:view admin panel'])->prefix('admin')->group(function () {
    Route::get('/roles', [AdminController::class, 'roles'])->name('admin.roles');
    Route::get('/permissions', [AdminController::class, 'permissions'])->name('admin.permissions');

    Route::group(['prefix' => 'users'], function () {
        Route::get('/', [AdminController::class, 'index'])->name('admin.users');
        Route::post('/', [AdminController::class, 'store'])->name('admin.users.store');
        Route::patch('/{user}/roles', [AdminController::class, 'updateRoles'])->name('admin.users.roles');
        Route::patch('/{user}/permissions', [AdminController::class, 'updatePermissions'])->name('admin.users.permissions');
        Route::delete('/{user}', [AdminController::class, 'destroy'])->name('admin.users.delete');
    });

    Route::get('/audit', [AuditController::class, 'index'])->name('admin.audit')->middleware('permission:view audit logs');
});

Route::middleware('auth:sanctum')->prefix('workbench')->group(function () {
    Route::post('/tests', [TestsController::class, 'createBlankTest'])->middleware('permission:create tests')->name('workbench.tests.store');
    Route::get('/tests/{testId}', [TestsController::class, 'show'])->middleware('permission:edit tests')->name('workbench.tests.show');
    Route::put('/tests/{testId}', [TestsController::class, 'update'])->middleware('permission:edit tests')->name('workbench.tests.update');
    Route::post('/tests/{testId}/auto-fill', [TestsController::class, 'autoFill'])->middleware('permission:edit tests')->name('workbench.tests.auto_fill');
    Route::delete('/tests/{testId}', [TestsController::class, 'destroy'])->middleware('permission:delete tests')->name('workbench.tests.delete');
    Route::post('/questions/{questionId}/files', [QuestionFilesController::class, 'store'])->middleware('permission:edit tests')->name('workbench.questions.files.store');
    Route::delete('/questions/{questionId}/files/{fileId}', [QuestionFilesController::class, 'destroy'])->middleware('permission:edit tests')->name('workbench.questions.files.delete');
});

Route::get('/tests', [TestsController::class, 'index'])->name('tests.index');
Route::get('/tests/{testId}', [TestsController::class, 'publicShow'])->name('tests.show');