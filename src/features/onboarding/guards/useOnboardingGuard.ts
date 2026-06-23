import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useDatabaseContext } from '@/context/DatabaseContext';

export function useOnboardingGuard() {
    const router = useRouter();
    const { userProfile } = useDatabaseContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        userProfile.get().then((profile) => {
            if (!profile) {
                router.replace('/onboarding');
            } else {
                setLoading(false);
            }
        });
    }, [router, userProfile]);

    return { loading };
}
