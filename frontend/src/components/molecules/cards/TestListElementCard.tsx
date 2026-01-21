import { useNavigate } from "react-router-dom";

import { Test } from "../../../types/Test";

interface TestListElementCardProps {
    test: Test;
}

export const TestListElementCard = ({ test }: TestListElementCardProps) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/tests/${test.uuid}/start`)}
            className="group text-left bg-white/90 backdrop-blur shadow-sm hover:shadow-xl transition-all p-5 md:p-6 border border-slate-200/80 cursor-pointer rounded-lg hover:-translate-y-0.5"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                    <div className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                        {test.discipline_name}
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                        <span className="h-2 w-2 rounded-full bg-indigo-500" />
                        {test.questions.length} вопросов
                    </div>
                </div>
                <div className="shrink-0 text-indigo-600 font-semibold transition group-hover:translate-x-1">
                    Выбрать →
                </div>
            </div>
        </div>
    )
}