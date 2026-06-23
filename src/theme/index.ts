import { StyleSheet } from 'react-native-unistyles';
import { typography } from './typography';

const lightTheme = {
    colors: {
        primary: '#19FA00',
        background: '#FFFFFF',
        surface: '#F7F7F7',
        surfaceSecondary: '#F0F0F0',
        text: '#000000',
        textSecondary: '#1A1A1A',
        textTertiary: '#2E2E2E',
        border: '#E6E6E6',
        borderSecondary: '#D1D1D1',
        error: '#DC2626',
        success: '#16A34A',
    },
    spacing: (v: number) => v * 4,
    typography,
};

const darkTheme = {
    colors: {
        primary: '#19FA00',
        background: '#000000',
        surface: '#0F0F0F',
        surfaceSecondary: '#1A1A1A',
        text: '#FFFFFF',
        textSecondary: '#E8E8E8',
        textTertiary: '#D1D1D1',
        border: '#262626',
        borderSecondary: '#333333',
        error: '#FF5252',
        success: '#22C55E',
    },
    spacing: (v: number) => v * 4,
    typography,
};

const breakpoints = {
    xs: 0,
    sm: 400,
    md: 768,
    lg: 1024,
    xl: 1280,
};

const appThemes = { light: lightTheme, dark: darkTheme };

type AppThemes = typeof appThemes;
type AppBreakpoints = typeof breakpoints;

declare module 'react-native-unistyles' {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface UnistylesThemes extends AppThemes {}
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
    settings: { adaptiveThemes: true },
    breakpoints,
    themes: appThemes,
});
