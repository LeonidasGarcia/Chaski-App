import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useAppTheme } from '@/lib/useAppTheme';

interface ChipOption {
    label: string;
    value: string;
}

interface ChipSelectorProps {
    label: string;
    options: ChipOption[];
    selected: string;
    onSelect: (value: string) => void;
    error?: string;
}

export default function ChipSelector({
    label,
    options,
    selected,
    onSelect,
    error,
}: ChipSelectorProps) {
    const theme = useAppTheme();

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
            <View style={[localStyles.row, { gap: theme.spacing(2) }]}>
                {options.map((option) => {
                    const isSelected = option.value === selected;
                    return (
                        <TouchableOpacity
                            key={option.value}
                            onPress={() => onSelect(option.value)}
                            style={[
                                localStyles.chip,
                                {
                                    backgroundColor: isSelected
                                        ? theme.colors.primary
                                        : theme.colors.surface,
                                    borderColor:
                                        error && !isSelected
                                            ? theme.colors.error
                                            : theme.colors.border,
                                    borderRadius: theme.borderRadius.md,
                                    paddingHorizontal: theme.spacing(3),
                                    paddingVertical: theme.spacing(2),
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    theme.typography.presets.h3,
                                    {
                                        color: isSelected
                                            ? theme.colors.onPrimary
                                            : theme.colors.text,
                                    },
                                ]}
                            >
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
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
    container: {},
    row: {
        flexDirection: 'row',
    },
    chip: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
