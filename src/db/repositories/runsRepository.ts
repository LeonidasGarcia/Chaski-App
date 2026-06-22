import type { SQLiteDatabase } from 'expo-sqlite';
import type { RunRepository, CreateRun } from '@/types/database';

export function createRunsRepository(db: SQLiteDatabase) {
    return {
        getAll: () => db.getAllAsync<RunRepository>('SELECT * FROM runs ORDER BY date_iso DESC'),

        getById: (id: number) =>
            db.getFirstAsync<RunRepository>('SELECT * FROM runs WHERE id = ?', id),

        create: (data: CreateRun) =>
            db.runAsync(
                `INSERT INTO runs (date_iso, duration_seconds, distance_meters, avg_pace_min_km, route_coordinates_json)
         VALUES (?, ?, ?, ?, ?)`,
                data.date_iso,
                data.duration_seconds,
                data.distance_meters,
                data.avg_pace_min_km,
                data.route_coordinates_json,
            ),

        delete: (id: number) => db.runAsync('DELETE FROM runs WHERE id = ?', id),
    };
}
