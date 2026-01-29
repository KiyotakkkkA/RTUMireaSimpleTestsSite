interface InputSliderProps {
    min: number;
    max: number;
    step?: number;
    value: number;
    className?: string;
    onChange: (value: number) => void;
}

export const InputSlider = ({
    min,
    max,
    step = 1,
    value,
    className,
    onChange,
}: InputSliderProps) => {
    return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={`mt-4 w-full accent-indigo-600 ${className ?? ""}`}
        />
    );
};
