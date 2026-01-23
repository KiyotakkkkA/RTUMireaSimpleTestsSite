import { Spinner } from "../../atoms";

export const AdminAuditPage = () => {
    return (
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            <div className="flex items-center justify-center gap-2">
                <Spinner className="h-4 w-4" />
                Загружаем журналы...
            </div>
        </div>
    );
}