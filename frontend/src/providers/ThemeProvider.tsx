import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

type ThemeMode = "light" | "dark" | "system";

type ThemeContextValue = {
    theme: ThemeMode;
    resolvedTheme: "light" | "dark";
    setTheme: (theme: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "testix_theme";

const resolveTheme = (mode: ThemeMode, prefersDark: boolean) => {
    if (mode === "system") {
        return prefersDark ? "dark" : "light";
    }
    return mode;
};

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const [theme, setThemeState] = useState<ThemeMode>(() => {
        if (typeof window === "undefined") return "system";
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark" || stored === "system") {
            return stored;
        }
        return "system";
    });
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(
        "light",
    );

    const applyTheme = useCallback(
        (mode: ThemeMode) => {
            if (typeof window === "undefined") return;
            const media = window.matchMedia("(prefers-color-scheme: dark)");
            const nextResolved = resolveTheme(mode, media.matches);
            setResolvedTheme(nextResolved);
            document.documentElement.classList.toggle(
                "dark",
                nextResolved === "dark",
            );
        },
        [setResolvedTheme],
    );

    useEffect(() => {
        applyTheme(theme);
        if (typeof window !== "undefined") {
            window.localStorage.setItem(STORAGE_KEY, theme);
        }
    }, [theme, applyTheme]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            if (theme === "system") {
                applyTheme("system");
            }
        };
        media.addEventListener("change", handleChange);
        return () => media.removeEventListener("change", handleChange);
    }, [theme, applyTheme]);

    const setTheme = useCallback((mode: ThemeMode) => {
        setThemeState(mode);
    }, []);

    const value = useMemo(
        () => ({ theme, resolvedTheme, setTheme }),
        [theme, resolvedTheme, setTheme],
    );

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextValue => {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return ctx;
};
