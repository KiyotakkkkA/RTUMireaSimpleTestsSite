<?php

namespace App\Http\Controllers\Shared;

use App\Http\Requests\Admin\AdminTestsAccessIndexRequest;
use App\Http\Requests\Admin\AdminTestsAccessUpdateRequest;
use App\Http\Requests\Admin\AdminTestsAccessUsersRequest;
use App\Models\Test\Test;
use App\Services\Teacher\TeacherUsersService;
use App\Services\Shared\TestsAccessService;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;

class TestsAccessController extends Controller
{
    protected TestsAccessService $testsAccessService;
    protected TeacherUsersService $teacherUsersService;

    public function __construct(
        TestsAccessService $testsAccessService,
        TeacherUsersService $teacherUsersService,
    )
    {
        $this->testsAccessService = $testsAccessService;
        $this->teacherUsersService = $teacherUsersService;
    }

    public function index(AdminTestsAccessIndexRequest $request): Response
    {
        $validated = $request->validated();

        $data = $this->testsAccessService->listTests(
            $request->user(),
            $validated
        );

        return response($data, 200);
    }

    public function update(AdminTestsAccessUpdateRequest $request, string $testId): Response
    {
        $test = Test::with('accessUsers')->find($testId);
        if (!$test) {
            return response([
                'message' => 'Тест не найден',
            ], 404);
        }

        $this->authorize('update', $test);

        $validated = $request->validated();

        $updated = $this->testsAccessService->updateAccess(
            $request->user(),
            $test,
            $validated
        );

        return response([
            'test' => $updated,
        ], 200);
    }

    public function users(AdminTestsAccessUsersRequest $request): Response
    {
        $validated = $request->validated();

        $data = $this->testsAccessService->listUsers($validated);

        return response($data, 200);
    }

    public function groups(): Response
    {
        $data = $this->teacherUsersService->listGroupsForAccess(auth('sanctum')->user());

        return response($data, 200);
    }
}
