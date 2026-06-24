import { Appearance } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import type { ThemePreference } from '@/types/database';
import { bumpThemeVersion } from './themeVersion';

export function applyThemePreference(theme: ThemePreference) {
    console.log('[Theme] applyThemePreference:', theme);
    if (theme === 'SYSTEM') {
        const systemTheme = Appearance.getColorScheme() ?? 'light';
        console.log('[Theme] system scheme:', systemTheme);
        UnistylesRuntime.setTheme(systemTheme);
    } else {
        UnistylesRuntime.setTheme(theme.toLowerCase() as 'light' | 'dark');
    }
    console.log('[Theme] themeName after setTheme:', UnistylesRuntime.themeName);
    bumpThemeVersion();
}
