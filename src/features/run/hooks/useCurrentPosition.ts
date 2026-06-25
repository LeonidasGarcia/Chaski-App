import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export function useCurrentPosition(): { latitude: number; longitude: number } | null {
    const [position, setPosition] = useState<{ latitude: number; longitude: number } | null>(
        null,
    );

    useEffect(() => {
        const sub = Location.watchPositionAsync(
            { accuracy: Location.Accuracy.High, timeInterval: 200, distanceInterval: 0 },
            (loc) => {
                setPosition({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
            },
        );

        return () => {
            sub.then((s) => s.remove());
        };
    }, []);

    return position;
}
