import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

interface ButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
}

export default function Button({ title, onPress, disabled }: ButtonProps) {
    const { theme } = useUnistyles();

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
                    borderRadius: 12,
                    paddingVertical: theme.spacing(3.5),
                },
            ]}
        >
            <Text
                style={[theme.typography.presets.button, { color: '#000000', textAlign: 'center' }]}
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
