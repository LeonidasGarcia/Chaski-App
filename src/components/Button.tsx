import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '@/lib/useAppTheme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
}

export default function Button({ title, onPress, disabled }: ButtonProps) {
    const theme = useAppTheme();

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
            style={[
                localStyles.button,
                {
                    backgroundColor: theme.colors.primary,
                    opacity: disabled ? 0.5 : 1,
                    borderRadius: theme.borderRadius.md,
                    paddingVertical: theme.spacing(3.5),
                },
            ]}
        >
            <Text
                style={[theme.typography.presets.button, { color: theme.colors.onPrimary, textAlign: 'center' }]}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const localStyles = StyleSheet.create({
    button: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
