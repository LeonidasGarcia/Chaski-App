import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useDatabaseContext } from '@/context/DatabaseContext';
import type { UserProfileRepository } from '@/types/database';

export function useProfile() {
    const { userProfile } = useDatabaseContext();
    const [profile, setProfile] = useState<UserProfileRepository | null>(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            userProfile.get().then((p) => {
                setProfile(p);
                setLoading(false);
            });
        }, [userProfile]),
    );

    return { profile, loading };
}
