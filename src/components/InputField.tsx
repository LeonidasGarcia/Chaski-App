import { Text, TextInput, View, StyleSheet } from 'react-native';
import { useAppTheme } from '@/lib/useAppTheme';

interface InputFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    keyboardType?: 'default' | 'numeric';
    error?: string;
}

export default function InputField({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    error,
}: InputFieldProps) {
    const theme = useAppTheme();

    return (
        <View style={localStyles.container}>
            <Text
                style={[
                    theme.typography.presets.h3,
                    { color: theme.colors.text, marginBottom: theme.spacing(1) },
                ]}
            >
                {label}
            </Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textTertiary}
                keyboardType={keyboardType}
                style={[
                    localStyles.input,
                    {
                        color: theme.colors.text,
                        backgroundColor: theme.colors.surface,
                        borderColor: error ? theme.colors.error : theme.colors.border,
                        borderRadius: 12,
                        paddingHorizontal: theme.spacing(3),
                        paddingVertical: theme.spacing(3),
                        fontSize: 16,
                    },
                ]}
            />
            {error ? (
                <Text
                    style={[
                        theme.typography.presets.caption,
                        { color: theme.colors.error, marginTop: theme.spacing(1) },
                    ]}
                >
                    {error}
                </Text>
            ) : null}
        </View>
    );
}

const localStyles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
    },
});
