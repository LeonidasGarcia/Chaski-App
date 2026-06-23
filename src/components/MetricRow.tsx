import { Text, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

interface MetricRowProps {
    label: string;
    value: string;
}

export default function MetricRow({ label, value }: MetricRowProps) {
    const { theme } = useUnistyles();

    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: theme.spacing(1.5),
            }}
        >
            <Text style={[theme.typography.presets.body, { color: theme.colors.textSecondary }]}>
                {label}
            </Text>
            <Text style={[theme.typography.presets.body, { color: theme.colors.text }]}>
                {value}
            </Text>
        </View>
    );
}
