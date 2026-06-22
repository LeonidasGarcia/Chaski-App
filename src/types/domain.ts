import type { CreateRun } from './database';

export interface Coordinate {
    latitude: number;
    longitude: number;
    timestamp: string;
}

export interface Run {
    id: number;
    date_iso: string;
    duration_seconds: number;
    distance_meters: number;
    avg_pace_min_km: string;
    route_coordinates: Coordinate[];
}

export interface CreateRunInput extends Omit<CreateRun, 'route_coordinates_json'> {
    route_coordinates: Coordinate[];
}
