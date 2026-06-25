import { Appearance } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import type { ThemePreference } from '@/types/database';
import { bumpThemeVersion } from '@/context/ThemeContext';

export function applyThemePreference(theme: ThemePreference) {
    if (theme === 'SYSTEM') {
        const scheme = Appearance.getColorScheme();
        const systemTheme: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';
        UnistylesRuntime.setTheme(systemTheme);
    } else {
        UnistylesRuntime.setTheme(theme.toLowerCase() as 'light' | 'dark');
    }
    bumpThemeVersion();
}
