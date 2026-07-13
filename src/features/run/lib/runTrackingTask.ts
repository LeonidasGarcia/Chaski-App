import { defineTask } from 'expo-task-manager';
import * as SQLite from 'expo-sqlite';
import * as Notifications from 'expo-notifications';
import { cancelNotification, updateNotification } from './trackingNotification';

const TASK_NAME = 'BACKGROUND_RUN_TRACKING';
const MAX_ACCURACY = 25;
const OUTLIER_THRESHOLD = 80;
const MIN_DISTANCE = 2;
let lastPoint: { latitude: number; longitude: number } | null = null;
let startTime: number | null = null;
let totalDistance = 0;
let dbPromise: ReturnType<typeof SQLite.openDatabaseAsync> | null = null;

function haversine(
    a: { latitude: number; longitude: number },
    b: { latitude: number; longitude: number },
): number {
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

async function getDb(): Promise<SQLite.SQLiteDatabase> {
    if (!dbPromise) dbPromise = SQLite.openDatabaseAsync('chaski.db');
    return dbPromise;
}

export function resetRunTrackingState() {
    lastPoint = null;
    startTime = null;
    totalDistance = 0;
}

try {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowBanner: false,
            shouldShowList: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });
} catch {}

try {
    defineTask(TASK_NAME, async ({ data, error }) => {
        console.log('pene corriendo');
        try {
            if (error || !data) return;

            if (startTime === null) {
                startTime = Date.now();
                cancelNotification().catch(() => {});
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
                } catch {}
            }

            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            updateNotification(elapsed, totalDistance).catch(() => {});
        } catch {}
    });
    console.log('pene registro');
} catch {}
