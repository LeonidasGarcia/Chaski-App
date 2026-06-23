import { useEffect } from 'react';
import { UnistylesRuntime } from 'react-native-unistyles';
import { useDatabaseContext } from '@/context/DatabaseContext';

export function useApplyThemePreference() {
    const { userProfile } = useDatabaseContext();

    useEffect(() => {
        userProfile.get().then((p) => {
            if (p && p.theme_preference !== 'SYSTEM') {
                UnistylesRuntime.setAdaptiveThemes(false);
                UnistylesRuntime.setTheme(p.theme_preference.toLowerCase() as 'light' | 'dark');
            }
        });
    }, [userProfile]);
}
