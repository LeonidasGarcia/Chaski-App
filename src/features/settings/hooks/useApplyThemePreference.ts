import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { useDatabaseContext } from '@/context/DatabaseContext';
import { applyThemePreference } from '@/lib/theme';
import { bumpThemeVersion } from '@/context/ThemeContext';

export function useApplyThemePreference() {
    const { userProfile } = useDatabaseContext();

    useEffect(() => {
        userProfile.get().then((p) => {
            if (!p) return;
            applyThemePreference(p.theme_preference);

            if (p.theme_preference === 'SYSTEM') {
                const subscription = Appearance.addChangeListener(({ colorScheme }) => {
                    const resolved: 'light' | 'dark' = colorScheme === 'dark' ? 'dark' : 'light';
                    UnistylesRuntime.setTheme(resolved);
                    bumpThemeVersion();
                });
                return () => subscription.remove();
            }
        });
    }, [userProfile]);
}
