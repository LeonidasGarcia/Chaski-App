import { UnistylesRuntime } from 'react-native-unistyles';
import { useThemeVersion } from '@/context/ThemeContext';
import { lightTheme, darkTheme } from '@/theme';

function getActiveTheme() {
    return UnistylesRuntime.themeName === 'dark' ? darkTheme : lightTheme;
}

export function useAppTheme() {
    useThemeVersion();
    return getActiveTheme();
}
