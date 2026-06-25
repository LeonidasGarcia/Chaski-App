import { type ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { useAppTheme } from '@/lib/useAppTheme';

interface Props {
    children: ReactNode;
}

export default function LocationPermissionGate({ children }: Props) {
    const theme = useAppTheme();
    const [permission, requestPermission] = Location.useForegroundPermissions();

    if (permission?.granted) {
        return <>{children}</>;
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.colors.background,
                paddingHorizontal: theme.spacing(6),
            }}
        >
            <Text
                style={[
                    theme.typography.presets.h1,
                    { color: theme.colors.text, textAlign: 'center', marginBottom: theme.spacing(4) },
                ]}
            >
                Ubicación
            </Text>
            <Text
                style={[
                    theme.typography.presets.body,
                    {
                        color: theme.colors.textSecondary,
                        textAlign: 'center',
                        marginBottom: theme.spacing(8),
                    },
                ]}
            >
                Necesitamos acceso a tu ubicación para registrar tus rutas al correr.
            </Text>
            <TouchableOpacity
                onPress={requestPermission}
                activeOpacity={0.8}
                style={{
                    backgroundColor: theme.colors.primary,
                    borderRadius: theme.borderRadius.xl,
                    paddingHorizontal: theme.spacing(8),
                    paddingVertical: theme.spacing(3),
                }}
            >
                <Text
                    style={[
                        theme.typography.presets.button,
                        { color: theme.colors.onPrimary },
                    ]}
                >
                    PERMITIR UBICACIÓN
                </Text>
            </TouchableOpacity>
        </View>
    );
}
