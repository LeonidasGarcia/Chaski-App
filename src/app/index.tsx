import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useDatabaseContext } from '@/context/DatabaseContext';

export default function HomeScreen() {
    const router = useRouter();
    const { userProfile } = useDatabaseContext();

    useEffect(() => {
        userProfile.get().then((profile) => {
            if (!profile) {
                router.replace('/onboarding');
            } else {
                router.replace('/(tabs)/profile');
            }
        });
    }, [router, userProfile]);

    return null;
}
