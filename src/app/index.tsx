import { useOnboardingGuard } from '@/features/onboarding/guards/useOnboardingGuard';

export default function HomeScreen() {
    useOnboardingGuard();
    return null;
}
