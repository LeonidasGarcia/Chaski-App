import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { useAppTheme } from '@/lib/useAppTheme';

export default function MapScreen() {
    const theme = useAppTheme();
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
        </View>
    );
}
