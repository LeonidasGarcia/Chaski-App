import { useEffect, useRef } from 'react';
import { Appearance } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { useDatabaseContext } from '@/context/DatabaseContext';
import { applyThemePreference } from '@/lib/theme';
import { bumpThemeVersion, useThemeVersion } from '@/context/ThemeContext';

export function useApplyThemePreference() {
    const { userProfile } = useDatabaseContext();
    const version = useThemeVersion();
    const subscriptionRef = useRef<{ remove: () => void } | null>(null);
    const initialRef = useRef(false);

    useEffect(() => {
        let cancelled = false;

        userProfile.get().then((p) => {
            if (cancelled || !p) return;

            if (!initialRef.current) {
                applyThemePreference(p.theme_preference);
                initialRef.current = true;
            }

            subscriptionRef.current?.remove();
            subscriptionRef.current = null;

            if (p.theme_preference === 'SYSTEM') {
                subscriptionRef.current = Appearance.addChangeListener(({ colorScheme }) => {
                    const resolved: 'light' | 'dark' = colorScheme === 'dark' ? 'dark' : 'light';
                    UnistylesRuntime.setTheme(resolved);
                    bumpThemeVersion();
                });
            }
        });

        return () => {
            cancelled = true;
            subscriptionRef.current?.remove();
            subscriptionRef.current = null;
        };
    }, [userProfile, version]);
}
