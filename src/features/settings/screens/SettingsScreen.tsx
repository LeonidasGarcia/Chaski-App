import { View } from 'react-native';
import ScreenContainer from '@/components/ScreenContainer';
import SectionCard from '@/components/SectionCard';
import ChipSelector from '@/components/ChipSelector';
import { THEME_OPTIONS } from '@/constants';
import { useThemeToggle } from '../hooks/useThemeToggle';
import { useAppTheme } from '@/lib/useAppTheme';

export default function SettingsScreen() {
    const theme = useAppTheme();
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
                </SectionCard>
            </View>
        </ScreenContainer>
    );
}
