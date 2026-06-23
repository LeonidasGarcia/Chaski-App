import { useEffect, useState } from 'react';
import { UnistylesRuntime } from 'react-native-unistyles';
import { useDatabaseContext } from '@/context/DatabaseContext';
import type { ThemePreference } from '@/types/database';

export function useThemeToggle() {
    const { userProfile } = useDatabaseContext();
    const [preference, setPreference] = useState<ThemePreference | null>(null);

    useEffect(() => {
        userProfile.get().then((p) => {
            if (p) setPreference(p.theme_preference);
        });
    }, [userProfile]);

    const updateTheme = (theme: ThemePreference) => {
        setPreference(theme);
        userProfile.updateTheme(theme);

        if (theme === 'SYSTEM') {
            UnistylesRuntime.setAdaptiveThemes(true);
        } else {
            UnistylesRuntime.setAdaptiveThemes(false);
            UnistylesRuntime.setTheme(theme.toLowerCase() as 'light' | 'dark');
        }
    };

    return { preference, updateTheme, loading: preference === null };
}
