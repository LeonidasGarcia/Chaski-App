import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useDatabaseContext } from '@/context/DatabaseContext';
import { onboardingSchema, type OnboardingFormData } from '../schemas/onboarding';

export function useOnboardingForm() {
    const router = useRouter();
    const { userProfile } = useDatabaseContext();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<OnboardingFormData>({
        resolver: zodResolver(onboardingSchema as any),
        defaultValues: {
            name: '',
            theme_preference: 'SYSTEM',
        },
    });

    const onSubmit = handleSubmit(async (data: OnboardingFormData) => {
        await userProfile.upsert({
            name: data.name,
            age: data.age,
            weight_kg: data.weight_kg,
            height_cm: data.height_cm,
            gender: data.gender,
            theme_preference: data.theme_preference,
            updated_at: new Date().toISOString(),
        });
        router.replace('/');
    });

    return { control, errors, isSubmitting, onSubmit };
}
