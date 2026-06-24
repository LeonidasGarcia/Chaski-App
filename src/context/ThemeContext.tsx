import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface ThemeVersionContextValue {
    version: number;
    bump: () => void;
}

const ThemeVersionContext = createContext<ThemeVersionContextValue | null>(null);

let _bump: (() => void) | null = null;

export function bumpThemeVersion() {
    _bump?.();
}

export function useThemeVersion() {
    const ctx = useContext(ThemeVersionContext);
    if (!ctx) throw new Error('useThemeVersion must be used within ThemeVersionProvider');
    return ctx.version;
}

export function ThemeVersionProvider({ children }: { children: ReactNode }) {
    const [version, setVersion] = useState(0);

    const bump = useCallback(() => {
        setVersion((v) => v + 1);
    }, []);

    _bump = bump;

    const value = useMemo(() => ({ version, bump }), [version, bump]);

    return (
        <ThemeVersionContext.Provider value={value}>
            {children}
        </ThemeVersionContext.Provider>
    );
}
