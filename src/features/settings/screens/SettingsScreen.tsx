import { Text, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import ScreenContainer from '@/components/ScreenContainer';
import SectionCard from '@/components/SectionCard';
import ChipSelector from '@/components/ChipSelector';
import { THEME_OPTIONS } from '@/constants';
import { useThemeToggle } from '../hooks/useThemeToggle';

const THEME_LABELS: Record<string, string> = {
    LIGHT: 'Claro',
    DARK: 'Oscuro',
    SYSTEM: 'Sistema',
};

export default function SettingsScreen() {
    const { theme } = useUnistyles();
    const { preference, updateTheme, loading } = useThemeToggle();

    if (loading || !preference) return null;

    return (
        <ScreenContainer>
            <View style={{ marginTop: theme.spacing(2) }}>
                <SectionCard title="Apariencia">
                    <ChipSelector
                        label="Tema"
                        options={THEME_OPTIONS}
                        selected={preference}
                        onSelect={(value) => updateTheme(value as 'LIGHT' | 'DARK' | 'SYSTEM')}
                    />
                    <Text
                        style={[
                            theme.typography.presets.caption,
                            {
                                color: theme.colors.textTertiary,
                                marginTop: theme.spacing(2),
                            },
                        ]}
                    >
                        Tema actual: {THEME_LABELS[preference]}
                    </Text>
                </SectionCard>
            </View>
        </ScreenContainer>
    );
}
