import { type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

interface SectionCardProps {
    children: ReactNode;
    title?: string;
}

export default function SectionCard({ children, title }: SectionCardProps) {
    const { theme } = useUnistyles();

    return (
        <View
            style={{
                backgroundColor: theme.colors.surface,
                marginHorizontal: theme.spacing(4),
                marginBottom: theme.spacing(3),
                padding: theme.spacing(4),
                borderRadius: 12,
            }}
        >
            {title ? (
                <Text
                    style={[
                        theme.typography.presets.h3,
                        {
                            color: theme.colors.text,
                            marginBottom: theme.spacing(2),
                        },
                    ]}
                >
                    {title}
                </Text>
            ) : null}
            {children}
        </View>
    );
}
