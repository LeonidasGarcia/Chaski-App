import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import type { Coordinate } from '@/types/domain';

const OUTLIER_THRESHOLD_METERS = 80;
const MAX_ACCURACY_METERS = 25;
const MIN_DISTANCE_METERS = 3;

function haversine(a: Coordinate, b: Coordinate): number {
    const R = 6_371_000;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(b.latitude - a.latitude);
    const dLng = toRad(b.longitude - a.longitude);
    const sinDLat = Math.sin(dLat / 2);
    const sinDLng = Math.sin(dLng / 2);
    const h =
        sinDLat * sinDLat +
        Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * sinDLng * sinDLng;
    return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

interface UseRunTrackingReturn {
    isTracking: boolean;
    route: Coordinate[];
    elapsed: number;
    distanceMeters: number;
    speedKmh: number;
    start: () => void;
    stop: () => void;
    reset: () => void;
}

export function useRunTracking(): UseRunTrackingReturn {
    const [isTracking, setIsTracking] = useState(false);
    const [route, setRoute] = useState<Coordinate[]>([]);
    const [elapsed, setElapsed] = useState(0);
    const [distanceMeters, setDistanceMeters] = useState(0);
    const [speedKmh, setSpeedKmh] = useState(0);
    const watcherRef = useRef<Location.LocationSubscription | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const lastCoordRef = useRef<Coordinate | null>(null);

    const clearWatcher = useCallback(() => {
        if (watcherRef.current) {
            watcherRef.current.remove();
            watcherRef.current = null;
        }
    }, []);

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const start = useCallback(async () => {
        setRoute([]);
        setElapsed(0);
        setDistanceMeters(0);
        setSpeedKmh(0);
        lastCoordRef.current = null;
        setIsTracking(true);

        const watcher = await Location.watchPositionAsync(
            {
                timeInterval: 1000,
                distanceInterval: 0,
                accuracy: Location.Accuracy.High,
            },
            (loc) => {
                const coord: Coordinate = {
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    timestamp: new Date(loc.timestamp).toISOString(),
                };

                if (loc.coords.accuracy !== null && loc.coords.accuracy > MAX_ACCURACY_METERS) {
                    return;
                }

                if (lastCoordRef.current) {
                    const dist = haversine(lastCoordRef.current, coord);
                    if (dist > OUTLIER_THRESHOLD_METERS) {
                        return;
                    }
                    setDistanceMeters((prev) => prev + dist);
                }

                const speed = loc.coords.speed !== null ? Math.round(loc.coords.speed * 3.6) : 0;

                lastCoordRef.current = coord;
                setSpeedKmh(speed);
                setRoute((prev) => [...prev, coord]);
            },
        );
        watcherRef.current = watcher;

        timerRef.current = setInterval(() => {
            setElapsed((prev) => prev + 1);
        }, 1000);
    }, []);

    const stop = useCallback(() => {
        clearWatcher();
        clearTimer();
        setIsTracking(false);
    }, [clearWatcher, clearTimer]);

    const reset = useCallback(() => {
        clearWatcher();
        clearTimer();
        setRoute([]);
        setElapsed(0);
        setDistanceMeters(0);
        setSpeedKmh(0);
        lastCoordRef.current = null;
        setIsTracking(false);
    }, [clearWatcher, clearTimer]);

    useEffect(() => {
        return () => {
            clearWatcher();
            clearTimer();
        };
    }, [clearWatcher, clearTimer]);

    return { isTracking, route, elapsed, distanceMeters, speedKmh, start, stop, reset };
}
