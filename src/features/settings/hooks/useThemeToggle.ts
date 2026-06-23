import { useEffect, useState } from 'react';
import { useDatabaseContext } from '@/context/DatabaseContext';
import { applyThemePreference } from '@/lib/theme';
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
        applyThemePreference(theme);
    };

    return { preference, updateTheme, loading: preference === null };
}
