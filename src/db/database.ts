import type { SQLiteDatabase } from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 1;
    const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    const currentDbVersion = result?.user_version ?? 0;

    if (currentDbVersion >= DATABASE_VERSION) return;

    if (currentDbVersion === 0) {
        await db.execAsync('PRAGMA journal_mode = WAL');

        await db.execAsync(`CREATE TABLE IF NOT EXISTS user_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        weight_kg REAL NOT NULL,
        height_cm REAL NOT NULL,
        gender TEXT NOT NULL CHECK(gender IN ('MALE', 'FEMALE', 'OTHER')),
        theme_preference TEXT NOT NULL DEFAULT 'SYSTEM' CHECK(theme_preference IN ('LIGHT', 'DARK', 'SYSTEM')),
        updated_at TEXT NOT NULL
      )`);

        await db.execAsync(`CREATE TABLE IF NOT EXISTS runs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date_iso TEXT NOT NULL,
        duration_seconds INTEGER NOT NULL,
        distance_meters REAL NOT NULL,
        avg_pace_min_km TEXT NOT NULL,
        route_coordinates_json TEXT NOT NULL
      )`);

        await db.execAsync(`CREATE TABLE IF NOT EXISTS challenges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        run_id INTEGER NOT NULL UNIQUE,
        target_distance_meters REAL NOT NULL,
        target_time_seconds INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'FAILED' CHECK(status IN ('FAILED', 'ACHIEVED', 'SURPASSED')),
        FOREIGN KEY (run_id) REFERENCES runs(id) ON DELETE CASCADE
      )`);

        await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
    }
}
