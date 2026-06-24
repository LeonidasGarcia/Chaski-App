import { useThemeVersion, getActiveTheme } from './themeVersion';

export function useAppTheme() {
    useThemeVersion();
    return getActiveTheme();
}
