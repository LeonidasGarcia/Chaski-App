import { defineTask } from 'expo-task-manager';
import * as SQLite from 'expo-sqlite';
import { cancelNotification, updateNotification } from './trackingNotification';
import { haversine } from './haversine';

const TASK_NAME = 'BACKGROUND_RUN_TRACKING';
const MAX_ACCURACY = 25;
const OUTLIER_THRESHOLD = 80;
const MIN_DISTANCE = 2;
let lastPoint: { latitude: number; longitude: number } | null = null;
let startTime: number | null = null;
let totalDistance = 0;
let dbPromise: ReturnType<typeof SQLite.openDatabaseAsync> | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
    if (!dbPromise) dbPromise = SQLite.openDatabaseAsync('chaski.db');
    return dbPromise;
}

export function resetRunTrackingState() {
    lastPoint = null;
    startTime = null;
    totalDistance = 0;
}

defineTask(TASK_NAME, async ({ data, error }) => {
    try {
        if (error || !data) return;

        if (startTime === null) {
            startTime = Date.now();
            cancelNotification().catch((e) =>
                console.warn('[runTrackingTask] cancelNotification failed:', e),
            );
        }

        const db = await getDb();
        const locations = (data as any).locations ?? [];

        for (const loc of locations) {
            if (loc.coords.accuracy !== null && loc.coords.accuracy > MAX_ACCURACY) continue;

            const coord = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };

            if (lastPoint) {
                const dist = haversine(lastPoint, coord);
                if (dist < MIN_DISTANCE) continue;
                if (dist > OUTLIER_THRESHOLD) continue;
                totalDistance += dist;
            }

            lastPoint = coord;

            try {
                await db.runAsync(
                    'INSERT INTO route_points (latitude, longitude, timestamp, accuracy, speed) VALUES (?, ?, ?, ?, ?)',
                    loc.coords.latitude,
                    loc.coords.longitude,
                    new Date(loc.timestamp).toISOString(),
                    loc.coords.accuracy,
                    loc.coords.speed,
                );
            } catch (e) {
                console.warn('[runTrackingTask] Failed to insert route point:', e);
            }
        }

        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        updateNotification(elapsed, totalDistance).catch((e) =>
            console.warn('[runTrackingTask] updateNotification failed:', e),
        );
    } catch (e) {
        console.warn('[runTrackingTask] Task execution failed:', e);
    }
});
