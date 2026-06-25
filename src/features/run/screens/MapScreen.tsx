import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useAppTheme } from '@/lib/useAppTheme';
import SafeScreenContainer from '@/components/SafeScreenContainer';

export default function MapScreen() {
    const theme = useAppTheme();
    const router = useRouter();
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permiso de ubicación denegado');
                return;
            }
            const loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);
        })();
    }, []);

    if (errorMsg) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <Text style={{ color: theme.colors.error }}>{errorMsg}</Text>
            </View>
        );
    }

    return (
        <SafeScreenContainer edges={['top', 'bottom']}>
            <View style={{ flex: 1 }}>
                <MapView
                    style={{ flex: 1 }}
                    showsUserLocation
                    followsUserLocation
                    initialRegion={
                        location
                            ? {
                                  latitude: location.coords.latitude,
                                  longitude: location.coords.longitude,
                                  latitudeDelta: 0.01,
                                  longitudeDelta: 0.01,
                              }
                            : undefined
                    }
                />
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
            </View>
        </SafeScreenContainer>
    );
}
