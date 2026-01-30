import { Icon } from "@iconify/react";

export type ListViewOptionsKeys = "table" | "cards";

type ListViewOptions = Record<
    ListViewOptionsKeys,
    {
        icon: React.ReactNode;
        hint: string;
    }
>;

interface ListViewProps {
    iconSize?: number;
    options: ListViewOptions;
    state: ListViewOptionsKeys;
    onChange?: (value: ListViewOptionsKeys) => void;
    className?: string;
}

export const ListView = ({
    options,
    className,
    iconSize = 20,
    onChange,
    state,
}: ListViewProps) => {
    return (
        <div className={`border flex gap-2 ${className}`}>
            {Object.entries(options).map(([key, { icon, hint }]) => (
                <div
                    key={key}
                    className={`inline-block cursor-pointer p-1 rounded-lg hover:opacity-75 transition-opacity ${state === key ? "text-indigo-500" : "text-slate-400"}`}
                    title={hint}
                    onClick={() => onChange?.(key as ListViewOptionsKeys)}
                >
                    <Icon
                        icon={icon as string}
                        width={iconSize}
                        height={iconSize}
                    />
                </div>
            ))}
        </div>
    );
};
