import { useEffect } from 'react';
import { useDatabaseContext } from '@/context/DatabaseContext';
import { applyThemePreference } from '@/lib/theme';

export function useApplyThemePreference() {
    const { userProfile } = useDatabaseContext();

    useEffect(() => {
        userProfile.get().then((p) => {
            if (p) applyThemePreference(p.theme_preference);
        });
    }, [userProfile]);
}
