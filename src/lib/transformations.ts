import type { RunRepository } from '@/types/database';
import type { Coordinate, Run } from '@/types/domain';

export function parseRunCoordinates(json: string): Coordinate[] {
    return JSON.parse(json) as Coordinate[];
}

export function serializeCoordinates(coords: Coordinate[]): string {
    return JSON.stringify(coords);
}

export function toRun(raw: RunRepository): Run {
    return {
        id: raw.id,
        date_iso: raw.date_iso,
        duration_seconds: raw.duration_seconds,
        distance_meters: raw.distance_meters,
        avg_pace_min_km: raw.avg_pace_min_km,
        route_coordinates: parseRunCoordinates(raw.route_coordinates_json),
    };
}
