import { Text, View } from 'react-native';
import { useOnboardingGuard } from '@/features/onboarding/guards/useOnboardingGuard';

export default function HomeScreen() {
    const { loading } = useOnboardingGuard();

    if (loading) return null;

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Chaski-App</Text>
        </View>
    );
}
