# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

# Database Layer

## Stack

- `expo-sqlite@~56.0.5` con `SQLiteProvider` + `useSQLiteContext`
- WAL journal mode activado en migración
- Web requiere `.wasm` en Metro config (ya configurado)

## Arquitectura

- `src/types/database.ts` → tipos raw de la BD (`*Repository`, `Create*`)
- `src/types/domain.ts` → tipos de dominio (`Coordinate`, `Run`, etc.)
- `src/db/database.ts` → `migrateDbIfNeeded()` con CREATE TABLE + CHECK constraints
- `src/db/repositories/` → funciones fábrica que reciben `db` y exponen CRUD tipado
- `src/lib/transformations.ts` → transformaciones entre raw y dominio
- `src/context/DatabaseContext.tsx` → `DatabaseProvider` + `useDatabaseContext`
- `src/app/_layout.tsx` → `DatabaseProvider` envuelve el `Stack`

## Repositorios

### userProfileRepository (singleton, id=1)

| Método | Descripción |
|--------|-------------|
| `get()` | `UserProfileRepository \| null` |
| `upsert(data)` | INSERT OR REPLACE |
| `updateTheme(theme)` | Actualiza solo el tema |
| `delete()` | Elimina el perfil |

### runsRepository

| Método | Descripción |
|--------|-------------|
| `getAll()` | `Promise<Run[]>` (coordenadas parseadas) |
| `getById(id)` | `Promise<Run \| null>` |
| `create(data)` | Acepta `CreateRunInput`, serializa coordenadas internamente |
| `delete(id)` | Elimina un run |

### challengesRepository

| Método | Descripción |
|--------|-------------|
| `getAll()` | `Promise<ChallengeRepository[]>` |
| `getByRunId(runId)` | `Promise<ChallengeRepository \| null>` |
| `create(data)` | Inserta un challenge |
| `updateStatus(id, status)` | Actualiza el estado |
| `delete(id)` | Elimina un challenge |

## Tipos principales

### `src/types/database.ts`
- `UserProfileRepository`, `RunRepository`, `ChallengeRepository`
- `CreateUserProfile`, `CreateRun`, `CreateChallenge`
- `Gender`, `ThemePreference`, `ChallengeStatus`

### `src/types/domain.ts`
- `Coordinate { latitude, longitude, timestamp }`
- `Run { ... route_coordinates: Coordinate[] }`
- `CreateRunInput { ... route_coordinates: Coordinate[] }`

## Uso en componentes

```tsx
import { useDatabaseContext } from '@/context/DatabaseContext';

function MyComponent() {
  const { runs, userProfile, challenges } = useDatabaseContext();
  // runs.getAll(), userProfile.get(), challenges.getByRunId(id), etc.
}
```

## DevTools

El inspector de BD se abre desde la terminal de Expo: Shift+M → Open expo-sqlite
