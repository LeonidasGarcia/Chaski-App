import { UnistylesRuntime } from 'react-native-unistyles';
import type { ThemePreference } from '@/types/database';

export function applyThemePreference(theme: ThemePreference) {
    if (theme === 'SYSTEM') {
        UnistylesRuntime.setAdaptiveThemes(true);
    } else {
        UnistylesRuntime.setAdaptiveThemes(false);
        UnistylesRuntime.setTheme(theme.toLowerCase() as 'light' | 'dark');
    }
}
