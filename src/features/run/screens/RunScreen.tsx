import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/lib/useAppTheme';
import ScreenContainer from '@/components/ScreenContainer';
import SectionCard from '@/components/SectionCard';
import Button from '@/components/Button';

export default function RunScreen() {
    const theme = useAppTheme();
    const router = useRouter();

    return (
        <ScreenContainer>
            <View style={{ marginTop: theme.spacing(4) }}>
                <SectionCard title="Correr">
                    <Text
                        style={[
                            theme.typography.presets.body,
                            { color: theme.colors.textSecondary, marginBottom: theme.spacing(3) },
                        ]}
                    >
                        Presiona el botón para abrir el mapa y comenzar tu ruta.
                    </Text>
                    <Button
                        title="Abrir mapa"
                        onPress={() => router.push('/map')}
                    />
                </SectionCard>
            </View>
        </ScreenContainer>
    );
}
