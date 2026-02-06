<?php

namespace App\Repositories;

use App\Filters\Teacher\TeacherGroupsFilter;
use App\Models\Group;
use App\Models\User;
use App\Traits\Filterable;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class GroupsRepository
{
    use Filterable;

    public function listGroups(array $filters = []): LengthAwarePaginator
    {
        $page = $filters['page'] ?? 1;
        $perPage = $filters['per_page'] ?? 10;

        $query = Group::query()
            ->with(['participants']);

        $this->queryFilterDependingOnPerms($query, 'created_by', 'groups master access');

        (new TeacherGroupsFilter($filters))->apply($query);

        return $query->orderByDesc('created_at')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function listGroupsAll(): Collection
    {
        $query = Group::query()->with(['participants']);

        $this->queryFilterDependingOnPerms($query, 'created_by', 'groups master access');

        return $query->orderByDesc('created_at')
            ->get();
    }

    public function createGroup(User $creator, string $name, array $userIds): Group
    {
        $group = Group::create([
            'name' => $name,
            'created_by' => $creator->id,
        ]);

        if (!empty($userIds)) {
            $group->participants()->sync($userIds);
        }

        return $this->loadParticipants($group);
    }

    public function updateName(Group $group, string $name): Group
    {
        $group->update(['name' => $name]);
        return $this->loadParticipants($group);
    }

    public function addParticipants(Group $group, array $userIds): Group
    {
        if (!empty($userIds)) {
            $group->participants()->syncWithoutDetaching($userIds);
        }

        return $this->loadParticipants($group);
    }

    public function removeParticipant(Group $group, int $userId): Group
    {
        $group->participants()->detach($userId);
        return $this->loadParticipants($group);
    }

    public function deleteGroup(Group $group): void
    {
        $group->delete();
    }

    public function loadParticipants(Group $group): Group
    {
        return $group->load(['participants']);
    }
}
