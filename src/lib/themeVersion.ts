import { useEffect, useState } from 'react';
import { UnistylesRuntime } from 'react-native-unistyles';
import { lightTheme, darkTheme } from '@/theme';

let version = 0;
const listeners = new Set<() => void>();

export function getActiveTheme() {
    return UnistylesRuntime.themeName === 'dark' ? darkTheme : lightTheme;
}

export function bumpThemeVersion() {
    version += 1;
    listeners.forEach((l) => l());
}

export function useThemeVersion() {
    const [, forceUpdate] = useState(0);
    useEffect(() => {
        const fn = () => forceUpdate((n) => n + 1);
        listeners.add(fn);
        return () => { listeners.delete(fn); };
    }, []);
}
