import { useState } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { useAppTheme } from '@/lib/useAppTheme';

interface NumericInputFieldProps {
    label: string;
    value: number | undefined;
    onChange: (value: number | undefined) => void;
    placeholder?: string;
    error?: string;
}

export default function NumericInputField({
    label,
    value,
    onChange,
    placeholder,
    error,
}: NumericInputFieldProps) {
    const theme = useAppTheme();
    const [text, setText] = useState(value != null ? String(value) : '');

    const handleChangeText = (newText: string) => {
        setText(newText);
        if (newText === '') {
            onChange(undefined);
        } else {
            const num = Number(newText);
            if (!isNaN(num)) {
                onChange(num);
            }
        }
    };

    return (
        <View style={[localStyles.container, { marginBottom: theme.spacing(4) }]}>
            <Text
                style={[
                    theme.typography.presets.h3,
                    { color: theme.colors.text, marginBottom: theme.spacing(1) },
                ]}
            >
                {label}
            </Text>
            <TextInput
                value={text}
                onChangeText={handleChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textTertiary}
                keyboardType="numeric"
                style={[
                    localStyles.input,
                    {
                        color: theme.colors.text,
                        backgroundColor: theme.colors.surface,
                        borderColor: error ? theme.colors.error : theme.colors.border,
                        borderRadius: theme.borderRadius.md,
                        paddingHorizontal: theme.spacing(3),
                        paddingVertical: theme.spacing(3),
                        ...theme.typography.presets.body,
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
    },
    input: {
        borderWidth: 1,
    },
});
