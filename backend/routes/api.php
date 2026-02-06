<?php

use App\Http\Controllers\Shared\TestsAccessController;
use App\Http\Controllers\Admin\AdminUsersController;
use App\Http\Controllers\AI\AIController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuditController;
use App\Http\Controllers\QuestionFilesController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\StatisticsController;
use App\Http\Controllers\Teacher\TeacherUsersController;
use App\Http\Controllers\TestsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Роуты аутентификации и авторизации
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('/login', [AuthController::class, 'login'])->name('auth.login');
    Route::post('/verify', [AuthController::class, 'verify'])->name('auth.verify');
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me'])->name('auth.me');
        Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
    });
});

// Роуты для интеграции с языковыми моделями
Route::prefix('ai')->group(function () {
    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::post('/fill-test', [AIController::class, 'fillTestFromText'])->middleware('permission:edit tests')->name('ai.fill_test');
    });
    Route::post('/grade-full-answer', [AIController::class, 'gradeFullAnswer'])->name('ai.grade_full_answer');
});

// Общие роуты для панели администратора и преподавателя
Route::middleware(['auth:sanctum', 'permission:view admin panel|view teacher panel'])->prefix('shared')->group(function () {
    Route::group(['prefix' => 'tests'], function () {
        Route::get('/access', [TestsAccessController::class, 'index'])
            ->middleware('permission:edit tests access')
            ->name('admin.tests.access');
        Route::get('/access/users', [TestsAccessController::class, 'users'])
            ->middleware('permission:edit tests access')
            ->name('admin.tests.access.users');
        Route::get('/access/groups', [TestsAccessController::class, 'groups'])
            ->middleware('permission:edit tests access')
            ->name('admin.tests.access.groups');
        Route::patch('/{testId}/access', [TestsAccessController::class, 'update'])
            ->middleware('permission:edit tests access')
            ->name('admin.tests.access.update');
    });

    Route::group(['prefix' => 'statistics'], function () {
        Route::get('/', [AdminUsersController::class, 'statistics'])->name('admin.statistics')->middleware('permission:view statistics');
        Route::get('/day', [AdminUsersController::class, 'statisticsByDay'])->name('admin.statistics.day')->middleware('permission:view statistics');
    });
});

// Роуты для панели администратора
Route::middleware(['auth:sanctum', 'permission:view admin panel'])->prefix('admin')->group(function () {
    Route::get('/roles', [AdminUsersController::class, 'roles'])->name('admin.roles');
    Route::get('/permissions', [AdminUsersController::class, 'permissions'])->name('admin.permissions');

    Route::get('/audit', [AuditController::class, 'index'])->name('admin.audit')->middleware('permission:view audit logs');

    Route::group(['prefix' => 'users'], function () {
        Route::get('/', [AdminUsersController::class, 'index'])->name('admin.users');
        Route::post('/', [AdminUsersController::class, 'store'])->middleware('permission:add users')->name('admin.users.store');
        Route::patch('/{user}/roles', [AdminUsersController::class, 'updateRoles'])->name('admin.users.roles');
        Route::patch('/{user}/permissions', [AdminUsersController::class, 'updatePermissions'])->middleware('assign permissions')->name('admin.users.permissions');
        Route::delete('/{user}', [AdminUsersController::class, 'destroy'])->middleware('permission:remove users')->name('admin.users.delete');
    });
});

// Роуты для панели преподавателя
Route::middleware(['auth:sanctum', 'permission:view teacher panel'])->prefix('teacher')->group(function () {
    Route::group(['prefix' => 'groups'], function () {
        Route::get('/', [TeacherUsersController::class, 'index'])->name('teacher.groups.index');
        Route::post('/', [TeacherUsersController::class, 'store'])->middleware('permission:add users')->name('teacher.groups.store');
        
        Route::patch('/{group}/name', [TeacherUsersController::class, 'updateName'])->middleware('permission:add users')->name('teacher.groups.update_name');
        Route::post('/{group}/participants', [TeacherUsersController::class, 'addParticipants'])->middleware('permission:add users')->name('teacher.groups.add_participants');
        Route::delete('/{group}/participants/{user}', [TeacherUsersController::class, 'removeParticipant'])->middleware('permission:add users')->name('teacher.groups.remove_participant');
        Route::delete('/{group}', [TeacherUsersController::class, 'destroy'])->middleware('permission:remove users')->name('teacher.groups.destroy');

        Route::get('/users', [TeacherUsersController::class, 'users'])->name('teacher.groups.users');
        Route::post('/users', [TeacherUsersController::class, 'registerUser'])->middleware('permission:add users')->name('teacher.groups.users.register');
    });
});

// Роуты для скачиваний файлов
Route::middleware('auth:sanctum')->prefix('download')->group(function () {
    
    Route::get('/test/{testId}/pdf', [ReportsController::class, 'makeTestToPDF'])->middleware('permission:make reports')->name('download.test.pdf');
    Route::get('/test/{testId}/json', [ReportsController::class, 'makeTestToJSON'])->middleware('permission:make reports')->name('download.test.json');

    Route::get('/admin/audit/pdf', [ReportsController::class, 'makeAuditToPDF'])->middleware('permission:make reports')->name('download.admin.audit.pdf');

    Route::get('/shared/statistics/excel', [ReportsController::class, 'makeStatisticsToExcel'])->middleware('permission:make reports')->name('download.shared.statistics.excel');
    Route::get('/shared/statistics/day/excel', [ReportsController::class, 'makeStatisticsDayToExcel'])->middleware('permission:make reports')->name('download.shared.statistics.day.excel');

});

// Роуты для редактирования тестов
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

// Роуты для всех
Route::get('/tests', [TestsController::class, 'index'])->name('tests.index');
Route::get('/tests/{testId}', [TestsController::class, 'publicShow'])->name('tests.show');

Route::post('/statistics/test', [StatisticsController::class, 'saveTetsCompletionStatistics'])->name('statistics.test.completion');