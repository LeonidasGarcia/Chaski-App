import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useAppTheme } from '@/lib/useAppTheme';
import SafeScreenContainer from '@/components/SafeScreenContainer';
import { useRunTracking } from '../hooks/useRunTracking';
import { useCurrentPosition } from '../hooks/useCurrentPosition';
import { MAP_STYLE } from '../constants/mapStyle';

function formatElapsed(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function MapScreen() {
    const theme = useAppTheme();
    const router = useRouter();
    const [initialRegion, setInitialRegion] = useState<
        | { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number }
        | undefined
    >(undefined);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const { isTracking, route, elapsed, start, stop } = useRunTracking();
    const currentPosition = useCurrentPosition();

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permiso de ubicación denegado');
                return;
            }
            const loc = await Location.getCurrentPositionAsync({});
            setInitialRegion({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        })();
    }, []);

    if (errorMsg) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: theme.colors.background,
                }}
            >
                <Text style={{ color: theme.colors.error }}>{errorMsg}</Text>
            </View>
        );
    }

    return (
        <SafeScreenContainer edges={['top', 'bottom']}>
            <View style={{ flex: 1 }}>
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={initialRegion}
                    customMapStyle={MAP_STYLE}
                    showsBuildings={false}
                >
                    {currentPosition && (
                        <Marker
                            coordinate={currentPosition}
                            anchor={{ x: 0.5, y: 0.5 }}
                        >
                            <View
                                style={{
                                    width: 14,
                                    height: 14,
                                    borderRadius: 7,
                                    backgroundColor: '#19FA00',
                                    borderWidth: 2,
                                    borderColor: '#FFFFFF',
                                }}
                            />
                        </Marker>
                    )}
                    {route.length > 1 && (
                        <Polyline
                            coordinates={route.map((c) => ({
                                latitude: c.latitude,
                                longitude: c.longitude,
                            }))}
                            strokeColor="#19FA00"
                            strokeWidth={4}
                        />
                    )}
                </MapView>

                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        position: 'absolute',
                        top: theme.spacing(2),
                        left: theme.spacing(4),
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1,
                    }}
                >
                    <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
                </TouchableOpacity>

                {isTracking && (
                    <View
                        style={{
                            position: 'absolute',
                            top: theme.spacing(2),
                            right: theme.spacing(4),
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            borderRadius: 8,
                            paddingHorizontal: theme.spacing(2),
                            paddingVertical: theme.spacing(1),
                            zIndex: 1,
                        }}
                    >
                        <Text
                            style={[
                                theme.typography.presets.display,
                                { color: '#FFFFFF', fontSize: 28 },
                            ]}
                        >
                            {formatElapsed(elapsed)}
                        </Text>
                    </View>
                )}

                <View
                    style={{
                        position: 'absolute',
                        bottom: theme.spacing(8),
                        left: 0,
                        right: 0,
                        alignItems: 'center',
                        zIndex: 1,
                    }}
                >
                    <TouchableOpacity
                        onPress={isTracking ? stop : start}
                        activeOpacity={0.8}
                        style={{
                            backgroundColor: isTracking ? theme.colors.error : theme.colors.primary,
                            borderRadius: 30,
                            paddingHorizontal: theme.spacing(8),
                            paddingVertical: theme.spacing(3),
                        }}
                    >
                        <Text
                            style={[
                                theme.typography.presets.button,
                                {
                                    color: isTracking ? '#FFFFFF' : '#000000',
                                    textTransform: 'uppercase',
                                },
                            ]}
                        >
                            {isTracking ? 'DETENER' : 'COMENZAR'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeScreenContainer>
    );
}
