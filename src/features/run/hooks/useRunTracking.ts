import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import * as Location from 'expo-location';
import type { Coordinate } from '@/types/domain';
import { useDatabaseContext } from '@/context/DatabaseContext';
import { resetRunTrackingState } from '../lib/runTrackingTask';
import { haversine } from '../lib/haversine';
import { cancelNotification, updateNotification } from '../lib/trackingNotification';

const TASK_NAME = 'BACKGROUND_RUN_TRACKING';
const OUTLIER_THRESHOLD_METERS = 80;
const MIN_DISTANCE_METERS = 2;
const MAX_ACCURACY_METERS = 25;

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
    const startTimeRef = useRef<number | null>(null);
    const distanceRef = useRef(0);

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
        if (startTimeRef.current !== null) {
            setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }
        lastCoordRef.current = coords[coords.length - 1];
    }, [routePoints]);

    const start = useCallback(async () => {
        await cancelNotification().catch((e) =>
            console.warn('[useRunTracking] cancelNotification failed:', e),
        );
        await routePoints
            .deleteAll()
            .catch((e) => console.warn('[useRunTracking] deleteAll failed:', e));
        resetRunTrackingState();

        setRoute([]);
        setElapsed(0);
        setDistanceMeters(0);
        setSpeedKmh(0);
        lastCoordRef.current = null;
        startTimeRef.current = Date.now();
        distanceRef.current = 0;
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
                    distanceRef.current += dist;
                    setDistanceMeters(distanceRef.current);
                }

                const speed = loc.coords.speed !== null ? Math.round(loc.coords.speed * 3.6) : 0;

                lastCoordRef.current = coord;
                setSpeedKmh(speed);
                setRoute((prev) => [...prev, coord]);

                if (AppState.currentState === 'background') {
                    const e =
                        startTimeRef.current !== null
                            ? Math.floor((Date.now() - startTimeRef.current) / 1000)
                            : 0;
                    updateNotification(e, distanceRef.current).catch((e) =>
                        console.warn('[useRunTracking] updateNotification failed:', e),
                    );
                }
            },
        );
        watcherRef.current = watcher;

        await Location.startLocationUpdatesAsync(TASK_NAME, {
            accuracy: Location.Accuracy.High,
            timeInterval: 500,
            distanceInterval: 0,
            showsBackgroundLocationIndicator: true,
        }).catch((e) => console.warn('[useRunTracking] startLocationUpdatesAsync failed:', e));

        timerRef.current = setInterval(() => {
            if (startTimeRef.current !== null) {
                setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
            }
        }, 1000);
    }, [routePoints]);

    const stop = useCallback(() => {
        cancelNotification().catch((e) =>
            console.warn('[useRunTracking] cancelNotification failed:', e),
        );
        Location.stopLocationUpdatesAsync(TASK_NAME).catch((e) =>
            console.warn('[useRunTracking] stopLocationUpdates failed:', e),
        );
        clearWatcher();
        clearTimer();
        routePoints.deleteAll().catch((e) => console.warn('[useRunTracking] deleteAll failed:', e));
        distanceRef.current = 0;
        startTimeRef.current = null;
        setIsTracking(false);
    }, [clearWatcher, clearTimer, routePoints]);

    const reset = useCallback(() => {
        cancelNotification().catch((e) =>
            console.warn('[useRunTracking] cancelNotification failed:', e),
        );
        Location.stopLocationUpdatesAsync(TASK_NAME).catch((e) =>
            console.warn('[useRunTracking] stopLocationUpdates failed:', e),
        );
        clearWatcher();
        clearTimer();
        routePoints.deleteAll().catch((e) => console.warn('[useRunTracking] deleteAll failed:', e));
        setRoute([]);
        setElapsed(0);
        setDistanceMeters(0);
        setSpeedKmh(0);
        distanceRef.current = 0;
        lastCoordRef.current = null;
        startTimeRef.current = null;
        setIsTracking(false);
    }, [clearWatcher, clearTimer, routePoints]);

    useEffect(() => {
        const sub = AppState.addEventListener('change', (nextState) => {
            if (nextState === 'background' && isTracking) {
                const e =
                    startTimeRef.current !== null
                        ? Math.floor((Date.now() - startTimeRef.current) / 1000)
                        : 0;
                updateNotification(e, distanceRef.current).catch((e) =>
                    console.warn('[useRunTracking] updateNotification failed:', e),
                );
            }

            if (nextState === 'active') {
                cancelNotification().catch((e) =>
                    console.warn('[useRunTracking] cancelNotification failed:', e),
                );
                lastCoordRef.current = null;
                reSyncFromDb();
            }
        });

        return () => {
            sub.remove();
        };
    }, [reSyncFromDb, isTracking]);

    useEffect(() => {
        return () => {
            Location.stopLocationUpdatesAsync(TASK_NAME).catch((e) =>
                console.warn('[useRunTracking] stopLocationUpdates failed:', e),
            );
            clearWatcher();
            clearTimer();
        };
    }, [clearWatcher, clearTimer]);

    return { isTracking, route, elapsed, distanceMeters, speedKmh, start, stop, reset };
}
