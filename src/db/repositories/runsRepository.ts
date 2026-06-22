import type { SQLiteDatabase } from 'expo-sqlite';
import type { RunRepository } from '@/types/database';
import type { CreateRunInput } from '@/types/domain';
import { toRun, serializeCoordinates } from '@/lib/transformations';

export function createRunsRepository(db: SQLiteDatabase) {
    return {
        getAll: async () => {
            const rows = await db.getAllAsync<RunRepository>(
                'SELECT * FROM runs ORDER BY date_iso DESC',
            );
            return rows.map(toRun);
        },

        getById: async (id: number) => {
            const row = await db.getFirstAsync<RunRepository>(
                'SELECT * FROM runs WHERE id = ?',
                id,
            );
            return row ? toRun(row) : null;
        },

        create: (data: CreateRunInput) =>
            db.runAsync(
                `INSERT INTO runs (date_iso, duration_seconds, distance_meters, avg_pace_min_km, route_coordinates_json)
         VALUES (?, ?, ?, ?, ?)`,
                data.date_iso,
                data.duration_seconds,
                data.distance_meters,
                data.avg_pace_min_km,
                serializeCoordinates(data.route_coordinates),
            ),

        delete: (id: number) => db.runAsync('DELETE FROM runs WHERE id = ?', id),
    };
}
