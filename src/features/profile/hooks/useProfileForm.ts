import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useDatabaseContext } from '@/context/DatabaseContext';
import { profileSchema, type ProfileFormData } from '../schemas/profile';

export function useProfileForm() {
    const router = useRouter();
    const { userProfile } = useDatabaseContext();
    const [loading, setLoading] = useState(true);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema as any),
        defaultValues: {
            name: '',
        },
    });

    useEffect(() => {
        userProfile.get().then((p) => {
            if (p) {
                reset({
                    name: p.name,
                    age: p.age,
                    weight_kg: p.weight_kg,
                    height_cm: p.height_cm,
                    gender: p.gender,
                });
            }
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [reset, userProfile]);

    const onSubmit = handleSubmit(async (data: ProfileFormData) => {
        const current = await userProfile.get();
        await userProfile.upsert({
            name: data.name,
            age: data.age,
            weight_kg: data.weight_kg,
            height_cm: data.height_cm,
            gender: data.gender,
            theme_preference: current?.theme_preference ?? 'SYSTEM',
            updated_at: new Date().toISOString(),
        });
        router.back();
    });

    return { control, errors, isSubmitting, loading, onSubmit };
}
