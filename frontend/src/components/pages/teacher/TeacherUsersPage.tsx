import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";

import {
    ArrayAutoFillSelector,
    Button,
    InputBig,
    InputSmall,
} from "../../atoms";

type TeacherUserOption = {
    id: string;
    name: string;
    email: string;
};

type TeacherUserGroup = {
    id: string;
    name: string;
    description: string;
    userIds: string[];
    createdAt: Date;
};

const MOCK_USERS: TeacherUserOption[] = [
    { id: "1", name: "Анна Ким", email: "anna.kim@example.com" },
    { id: "2", name: "Илья Сорокин", email: "ilya.sorokin@example.com" },
    { id: "3", name: "Мария Орлова", email: "m.orlova@example.com" },
    { id: "4", name: "Дмитрий Савин", email: "d.savin@example.com" },
    { id: "5", name: "Олег Лебедев", email: "o.lebedev@example.com" },
    { id: "6", name: "Екатерина Павлова", email: "e.pavlova@example.com" },
    { id: "7", name: "София Громова", email: "s.gromova@example.com" },
    { id: "8", name: "Никита Захаров", email: "n.zakharov@example.com" },
];

export const TeacherUsersPage = () => {
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [groups, setGroups] = useState<TeacherUserGroup[]>([]);
    const [error, setError] = useState<string | null>(null);

    const userOptions = useMemo(
        () =>
            MOCK_USERS.map((user) => ({
                value: user.id,
                label: user.name,
                description: user.email,
            })),
        [],
    );

    const selectedUsersPreview = useMemo(() => {
        const selected = new Set(selectedUsers);
        return MOCK_USERS.filter((user) => selected.has(user.id));
    }, [selectedUsers]);

    const handleCreateGroup = () => {
        const trimmedName = groupName.trim();
        if (!trimmedName) {
            setError("Укажите название группы");
            return;
        }
        if (!selectedUsers.length) {
            setError("Выберите хотя бы одного пользователя");
            return;
        }

        const nextGroup: TeacherUserGroup = {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            name: trimmedName,
            description: groupDescription.trim(),
            userIds: selectedUsers,
            createdAt: new Date(),
        };

        setGroups((prev) => [nextGroup, ...prev]);
        setGroupName("");
        setGroupDescription("");
        setSelectedUsers([]);
        setError(null);
    };

    return (
        <div className="w-full space-y-6">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="text-2xl font-semibold text-slate-800">
                            Группы пользователей
                        </div>
                        <div className="text-sm text-slate-500">
                            Создавайте группы для быстрых назначений доступа и
                            работы с участниками.
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Icon icon="mdi:account-multiple" width={22} />
                        {MOCK_USERS.length} пользователей в сервисе
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <div className="text-lg font-semibold text-slate-800">
                        Создать группу
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                        Укажите название и выберите участников.
                    </div>

                    <div className="mt-5 space-y-4">
                        <div>
                            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Название группы
                            </div>
                            <InputSmall
                                value={groupName}
                                onChange={(event) =>
                                    setGroupName(event.target.value)
                                }
                                placeholder="Например: Поток 2026"
                                className="p-2"
                            />
                        </div>
                        <div>
                            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Описание
                            </div>
                            <InputBig
                                value={groupDescription}
                                onChange={(event) =>
                                    setGroupDescription(event.target.value)
                                }
                                placeholder="Опишите назначение группы"
                                className="min-h-[120px] p-3"
                            />
                        </div>
                        <div>
                            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Участники
                            </div>
                            <ArrayAutoFillSelector
                                options={userOptions}
                                value={selectedUsers}
                                onChange={setSelectedUsers}
                                placeholder="Введите имя или email"
                            />
                            <div className="mt-2 text-xs text-slate-400">
                                Выбрано: {selectedUsers.length}
                            </div>
                        </div>
                        {error && (
                            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                {error}
                            </div>
                        )}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Button
                                primary
                                className="px-4 py-2 text-sm"
                                onClick={handleCreateGroup}
                            >
                                Создать группу
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <div className="text-lg font-semibold text-slate-800">
                        Состав группы
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                        Предпросмотр выбранных пользователей.
                    </div>

                    <div className="mt-4 space-y-3">
                        {selectedUsersPreview.length === 0 && (
                            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-100 p-4 text-sm text-slate-400">
                                Пока никто не выбран.
                            </div>
                        )}
                        {selectedUsersPreview.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-100   p-3"
                            >
                                <div>
                                    <div className="text-sm font-medium text-slate-700">
                                        {user.name}
                                    </div>
                                    <div className="text-xs text-slate-400">
                                        {user.email}
                                    </div>
                                </div>
                                <span className="rounded-full bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-600">
                                    участник
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="text-lg font-semibold text-slate-800">
                            Созданные группы
                        </div>
                        <div className="text-sm text-slate-500">
                            Локальный список созданных групп.
                        </div>
                    </div>
                    <div className="text-sm text-slate-400">
                        Всего: {groups.length}
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    {groups.length === 0 && (
                        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-100 p-4 text-sm text-slate-400">
                            Группы пока не созданы.
                        </div>
                    )}
                    {groups.map((group) => {
                        const members = group.userIds
                            .map(
                                (id) =>
                                    MOCK_USERS.find((user) => user.id === id)
                                        ?.name,
                            )
                            .filter(Boolean)
                            .slice(0, 4) as string[];

                        return (
                            <div
                                key={group.id}
                                className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div>
                                        <div className="text-sm font-semibold text-slate-800">
                                            {group.name}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            Создано{" "}
                                            {group.createdAt.toLocaleString(
                                                "ru-RU",
                                            )}
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                                        {group.userIds.length} участников
                                    </span>
                                </div>
                                {group.description && (
                                    <div className="text-sm text-slate-600">
                                        {group.description}
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                                    {members.map((member) => (
                                        <span
                                            key={member}
                                            className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1"
                                        >
                                            {member}
                                        </span>
                                    ))}
                                    {group.userIds.length > members.length && (
                                        <span className="text-xs text-slate-400">
                                            +
                                            {group.userIds.length -
                                                members.length}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
