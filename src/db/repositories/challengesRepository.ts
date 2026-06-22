import type { SQLiteDatabase } from 'expo-sqlite';
import type { ChallengeRepository, CreateChallenge, ChallengeStatus } from '@/types/database';

export function createChallengesRepository(db: SQLiteDatabase) {
    return {
        getAll: () => db.getAllAsync<ChallengeRepository>('SELECT * FROM challenges'),

        getByRunId: (runId: number) =>
            db.getFirstAsync<ChallengeRepository>(
                'SELECT * FROM challenges WHERE run_id = ?',
                runId,
            ),

        create: (data: CreateChallenge) =>
            db.runAsync(
                `INSERT INTO challenges (run_id, target_distance_meters, target_time_seconds, status)
         VALUES (?, ?, ?, ?)`,
                data.run_id,
                data.target_distance_meters,
                data.target_time_seconds,
                data.status,
            ),

        updateStatus: (id: number, status: ChallengeStatus) =>
            db.runAsync('UPDATE challenges SET status = ? WHERE id = ?', status, id),

        delete: (id: number) => db.runAsync('DELETE FROM challenges WHERE id = ?', id),
    };
}
