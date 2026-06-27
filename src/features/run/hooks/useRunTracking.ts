import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import * as Location from 'expo-location';
import type { Coordinate } from '@/types/domain';
import { useDatabaseContext } from '@/context/DatabaseContext';
import { resetRunTrackingState } from '../lib/runTrackingTask';

const TASK_NAME = 'BACKGROUND_RUN_TRACKING';
const OUTLIER_THRESHOLD_METERS = 80;
const MIN_DISTANCE_METERS = 2;
const MAX_ACCURACY_METERS = 25;

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
    const { routePoints } = useDatabaseContext();
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

    const reSyncFromDb = useCallback(async () => {
        const points = await routePoints.getAll().catch(() => null);
        if (!points || points.length === 0) return;

        const coords: Coordinate[] = points.map((p) => ({
            latitude: p.latitude,
            longitude: p.longitude,
            timestamp: p.timestamp,
        }));

        let dist = 0;
        for (let i = 1; i < coords.length; i++) {
            dist += haversine(coords[i - 1], coords[i]);
        }

        const last = points[points.length - 1];
        const speed = last.speed !== null ? Math.round(last.speed * 3.6) : 0;

        setRoute(coords);
        setDistanceMeters(dist);
        setSpeedKmh(speed);
        lastCoordRef.current = coords[coords.length - 1];
    }, [routePoints]);

    const start = useCallback(async () => {
        await routePoints.deleteAll().catch(() => {});
        resetRunTrackingState();

        setRoute([]);
        setElapsed(0);
        setDistanceMeters(0);
        setSpeedKmh(0);
        lastCoordRef.current = null;
        setIsTracking(true);

        const watcher = await Location.watchPositionAsync(
            {
                timeInterval: 500,
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
                    if (dist < MIN_DISTANCE_METERS) return;
                    if (dist > OUTLIER_THRESHOLD_METERS) return;
                    setDistanceMeters((prev) => prev + dist);
                }

                const speed = loc.coords.speed !== null ? Math.round(loc.coords.speed * 3.6) : 0;

                lastCoordRef.current = coord;
                setSpeedKmh(speed);
                setRoute((prev) => [...prev, coord]);
            },
        );
        watcherRef.current = watcher;

        await Location.startLocationUpdatesAsync(TASK_NAME, {
            accuracy: Location.Accuracy.High,
            timeInterval: 500,
            distanceInterval: 0,
            showsBackgroundLocationIndicator: true,
        }).catch(() => {});

        timerRef.current = setInterval(() => {
            setElapsed((prev) => prev + 1);
        }, 1000);
    }, [routePoints]);

    const stop = useCallback(() => {
        Location.stopLocationUpdatesAsync(TASK_NAME).catch(() => {});
        clearWatcher();
        clearTimer();
        routePoints.deleteAll().catch(() => {});
        setIsTracking(false);
    }, [clearWatcher, clearTimer, routePoints]);

    const reset = useCallback(() => {
        Location.stopLocationUpdatesAsync(TASK_NAME).catch(() => {});
        clearWatcher();
        clearTimer();
        routePoints.deleteAll().catch(() => {});
        setRoute([]);
        setElapsed(0);
        setDistanceMeters(0);
        setSpeedKmh(0);
        lastCoordRef.current = null;
        setIsTracking(false);
    }, [clearWatcher, clearTimer, routePoints]);

    useEffect(() => {
        const sub = AppState.addEventListener('change', (nextState) => {
            if (nextState === 'active') {
                lastCoordRef.current = null;
                reSyncFromDb();
            }
        });

        return () => {
            sub.remove();
        };
    }, [reSyncFromDb]);

    useEffect(() => {
        return () => {
            Location.stopLocationUpdatesAsync(TASK_NAME).catch(() => {});
            clearWatcher();
            clearTimer();
        };
    }, [clearWatcher, clearTimer]);

    return { isTracking, route, elapsed, distanceMeters, speedKmh, start, stop, reset };
}
