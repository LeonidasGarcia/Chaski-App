import type { SQLiteDatabase } from 'expo-sqlite';
import type { RoutePointRepository, CreateRoutePoint } from '@/types/database';

export function createRoutePointsRepository(db: SQLiteDatabase) {
    return {
        getAll: async () => {
            const rows = await db.getAllAsync<RoutePointRepository>(
                'SELECT * FROM route_points ORDER BY timestamp',
            );
            return rows;
        },

        insert: (point: CreateRoutePoint) =>
            db.runAsync(
                'INSERT INTO route_points (latitude, longitude, timestamp, accuracy, speed) VALUES (?, ?, ?, ?, ?)',
                point.latitude,
                point.longitude,
                point.timestamp,
                point.accuracy,
                point.speed,
            ),

        deleteAll: () => db.runAsync('DELETE FROM route_points'),
    };
}
