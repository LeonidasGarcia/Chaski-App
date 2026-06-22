import type { SQLiteDatabase } from 'expo-sqlite';
import type { UserProfileRepository, CreateUserProfile, ThemePreference } from '@/types/database';

export function createUserProfileRepository(db: SQLiteDatabase) {
    return {
        get: () => db.getFirstAsync<UserProfileRepository>('SELECT * FROM user_profiles LIMIT 1'),

        upsert: (data: CreateUserProfile) =>
            db.runAsync(
                `INSERT OR REPLACE INTO user_profiles (id, name, age, weight_kg, height_cm, gender, theme_preference, updated_at)
         VALUES (1, ?, ?, ?, ?, ?, ?, ?)`,
                data.name,
                data.age,
                data.weight_kg,
                data.height_cm,
                data.gender,
                data.theme_preference,
                data.updated_at,
            ),

        updateTheme: (theme: ThemePreference) =>
            db.runAsync(
                'UPDATE user_profiles SET theme_preference = ?, updated_at = ? WHERE id = 1',
                theme,
                new Date().toISOString(),
            ),

        delete: () => db.runAsync('DELETE FROM user_profiles'),
    };
}
