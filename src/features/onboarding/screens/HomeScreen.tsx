import { useOnboardingGuard } from '../guards/useOnboardingGuard';

export default function HomeScreen() {
    useOnboardingGuard();
    return null;
}
