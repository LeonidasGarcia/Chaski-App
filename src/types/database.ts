export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type ThemePreference = 'LIGHT' | 'DARK' | 'SYSTEM';
export type ChallengeStatus = 'FAILED' | 'ACHIEVED' | 'SURPASSED';

export interface UserProfileRepository {
    id: number;
    name: string;
    age: number;
    weight_kg: number;
    height_cm: number;
    gender: Gender;
    theme_preference: ThemePreference;
    updated_at: string;
}

export interface RunRepository {
    id: number;
    date_iso: string;
    duration_seconds: number;
    distance_meters: number;
    avg_pace_min_km: string;
    route_coordinates_json: string;
}

export interface ChallengeRepository {
    id: number;
    run_id: number;
    target_distance_meters: number;
    target_time_seconds: number;
    status: ChallengeStatus;
}

export type CreateUserProfile = Omit<UserProfileRepository, 'id'>;
export type CreateRun = Omit<RunRepository, 'id'>;
export type CreateChallenge = Omit<ChallengeRepository, 'id'>;
