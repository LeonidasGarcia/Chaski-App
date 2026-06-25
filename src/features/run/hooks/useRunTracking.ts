import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import type { Coordinate } from '@/types/domain';

interface UseRunTrackingReturn {
    isTracking: boolean;
    route: Coordinate[];
    elapsed: number;
    start: () => void;
    stop: () => void;
    reset: () => void;
}

export function useRunTracking(): UseRunTrackingReturn {
    const [isTracking, setIsTracking] = useState(false);
    const [route, setRoute] = useState<Coordinate[]>([]);
    const [elapsed, setElapsed] = useState(0);
    const watcherRef = useRef<Location.LocationSubscription | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
        setIsTracking(true);

        const watcher = await Location.watchPositionAsync(
            { timeInterval: 1000, distanceInterval: 1 },
            (loc) => {
                const coord: Coordinate = {
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    timestamp: new Date(loc.timestamp).toISOString(),
                };
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
        setIsTracking(false);
    }, [clearWatcher, clearTimer]);

    useEffect(() => {
        return () => {
            clearWatcher();
            clearTimer();
        };
    }, [clearWatcher, clearTimer]);

    return { isTracking, route, elapsed, start, stop, reset };
}
