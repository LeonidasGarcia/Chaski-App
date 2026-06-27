import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useAppTheme } from '@/lib/useAppTheme';
import SafeScreenContainer from '@/components/SafeScreenContainer';
import { UnistylesRuntime } from 'react-native-unistyles';
import { useRunTracking } from '../hooks/useRunTracking';
import { useCurrentPosition } from '../hooks/useCurrentPosition';
import LocationPermissionGate from '@/components/LocationPermissionGate';
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
    const mapRef = useRef<MapView>(null);
    const [followUser, setFollowUser] = useState(true);
    const [displayedPosition, setDisplayedPosition] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const displayedPosRef = useRef({ latitude: 0, longitude: 0 });
    const { isTracking, route, elapsed, distanceMeters, speedKmh, start, stop } = useRunTracking();
    const currentPosition = useCurrentPosition();
    const isDark = UnistylesRuntime.themeName === 'dark';

    useEffect(() => {
        (async () => {
            const loc = await Location.getCurrentPositionAsync({});
            setInitialRegion({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
            });
        })();
    }, []);

    useEffect(() => {
        if (currentPosition && followUser) {
            mapRef.current?.animateCamera({
                center: currentPosition,
                zoom: 20,
            });
        }
    }, [currentPosition, followUser]);

    useEffect(() => {
        if (!currentPosition) return;

        if (!displayedPosition) {
            setDisplayedPosition(currentPosition);
            displayedPosRef.current = currentPosition;
            return;
        }

        const from = { ...displayedPosRef.current };
        const to = currentPosition;
        const startTime = Date.now();
        const duration = 200;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const t = Math.min(elapsed / duration, 1);
            const ease = t * (2 - t);

            const lat = from.latitude + (to.latitude - from.latitude) * ease;
            const lng = from.longitude + (to.longitude - from.longitude) * ease;

            displayedPosRef.current = { latitude: lat, longitude: lng };
            setDisplayedPosition({ latitude: lat, longitude: lng });

            if (t < 1) {
                animFrameRef.current = requestAnimationFrame(animate);
            }
        };

        animFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animFrameRef.current !== null) {
                cancelAnimationFrame(animFrameRef.current);
            }
        };
    }, [currentPosition]);

    return (
        <SafeScreenContainer edges={['top', 'bottom']}>
            <LocationPermissionGate>
                <View style={{ flex: 1 }}>
                    <MapView
                        key={`map-${isDark ? 'dark' : 'light'}`}
                        ref={mapRef}
                        style={{ flex: 1 }}
                        initialRegion={initialRegion}
                        userInterfaceStyle={isDark ? 'dark' : 'light'}
                        customMapStyle={MAP_STYLE}
                        showsBuildings={false}
                        onPanDrag={() => setFollowUser(false)}
                    >
                        {currentPosition && (
                            <Marker coordinate={displayedPosition ?? currentPosition} anchor={{ x: 0.5, y: 0.5 }}>
                                <View
                                    style={{
                                        width: 14,
                                        height: 14,
                                        borderRadius: 7,
                                        backgroundColor: theme.colors.primary,
                                        borderWidth: 2,
                                        borderColor: '#FFFFFF', // excepción: borde blanco sobre mapa nativo
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
                                strokeColor={theme.colors.primary}
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
                            borderRadius: theme.borderRadius.lg,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1,
                        }}
                    >
                        <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
                        {/* excepción: icono sobre overlay rgba */}
                    </TouchableOpacity>

                    {isTracking && (
                        <View
                            style={{
                                position: 'absolute',
                                top: theme.spacing(2),
                                right: theme.spacing(4),
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                borderRadius: theme.borderRadius.sm,
                                paddingHorizontal: theme.spacing(2),
                                paddingVertical: theme.spacing(1),
                                alignItems: 'center',
                                zIndex: 1,
                            }}
                        >
                            <Text
                                style={[
                                    theme.typography.presets.h1,
                                    { color: '#FFFFFF' }, // excepción: texto sobre overlay rgba
                                ]}
                            >
                                {formatElapsed(elapsed)}
                            </Text>
                            <Text
                                style={[
                                    theme.typography.presets.caption,
                                    { color: '#FFFFFF', marginTop: theme.spacing(0.5) }, // excepción: texto sobre overlay rgba
                                ]}
                            >
                                {(distanceMeters / 1000).toFixed(2)} km
                            </Text>
                            <Text
                                style={[
                                    theme.typography.presets.caption,
                                    { color: '#FFFFFF' }, // excepción: texto sobre overlay rgba
                                ]}
                            >
                                {speedKmh} km/h
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
                                backgroundColor: isTracking
                                    ? theme.colors.error
                                    : theme.colors.primary,
                                borderRadius: theme.borderRadius.xl,
                                paddingHorizontal: theme.spacing(8),
                                paddingVertical: theme.spacing(3),
                            }}
                        >
                            <Text
                                style={[
                                    theme.typography.presets.button,
                                    {
                                        color: isTracking
                                            ? theme.colors.onError
                                            : theme.colors.onPrimary,
                                    },
                                ]}
                            >
                                {isTracking ? 'DETENER' : 'COMENZAR'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {currentPosition && (
                        <TouchableOpacity
                            onPress={() => {
                                mapRef.current?.animateCamera({
                                    center: {
                                        latitude: currentPosition.latitude,
                                        longitude: currentPosition.longitude,
                                    },
                                    zoom: 20,
                                });
                                setFollowUser(true);
                            }}
                            style={{
                                position: 'absolute',
                                bottom: theme.spacing(16),
                                right: theme.spacing(4),
                                width: 40,
                                height: 40,
                                borderRadius: theme.borderRadius.lg,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 1,
                            }}
                        >
                            <Ionicons
                                name={followUser ? 'locate-sharp' : 'locate'}
                                size={22}
                                color={followUser ? theme.colors.primary : '#FFFFFF'}
                            />
                            {/* excepción: icono sobre overlay rgba */}
                        </TouchableOpacity>
                    )}
                </View>
            </LocationPermissionGate>
        </SafeScreenContainer>
    );
}
