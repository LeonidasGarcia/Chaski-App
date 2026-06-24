import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { useDatabaseContext } from '@/context/DatabaseContext';
import { applyThemePreference } from '@/lib/theme';
import { bumpThemeVersion } from '@/lib/themeVersion';

export function useApplyThemePreference() {
    const { userProfile } = useDatabaseContext();

    useEffect(() => {
        userProfile.get().then((p) => {
            if (!p) {
                console.log('[Theme] useApplyThemePreference: no profile found');
                return;
            }
            console.log('[Theme] useApplyThemePreference: restoring theme', p.theme_preference);
            applyThemePreference(p.theme_preference);

            if (p.theme_preference === 'SYSTEM') {
                const subscription = Appearance.addChangeListener(({ colorScheme }) => {
                    const resolved: 'light' | 'dark' = colorScheme === 'dark' ? 'dark' : 'light';
                    console.log('[Theme] system colorScheme changed to:', resolved);
                    UnistylesRuntime.setTheme(resolved);
                    bumpThemeVersion();
                });
                return () => subscription.remove();
            }
        });
    }, [userProfile]);
}
