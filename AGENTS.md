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

# Styling Layer

## Stack

- `react-native-unistyles@3.2.5` con `useUnistyles` + `StyleSheet.create(theme => ...)`
- `expo-font` con `@expo-google-fonts/rubik` y `@expo-google-fonts/plus-jakarta-sans`
- **Regla**: ningún componente debe tener colores, tipografías o espaciados hardcodeados. Todo se lee del tema.

## Arquitectura

- `src/theme/index.ts` → define temas light/dark con `colors`, `spacing`, `typography` + `StyleSheet.configure()`
- `src/theme/typography.ts` → `typography.presets` con 7 presets (display, h1, h2, h3, body, button, caption)
- `src/app/_layout.tsx` → carga fuentes con `useFonts()` antes de renderizar
- `index.ts` (raíz) → importa `./src/theme` antes que cualquier componente

## Colores del tema

Acceso vía `theme.colors.*`:

| Token | Light | Dark | Uso |
|---|---|---|---|
| `primary` | `#19FA00` | `#19FA00` | Botones, acentos, display |
| `background` | `#FFFFFF` | `#000000` | Fondo de pantallas |
| `surface` | `#F7F7F7` | `#0F0F0F` | Tarjetas, contenedores |
| `surfaceSecondary` | `#F0F0F0` | `#1A1A1A` | Secondary cards |
| `text` | `#000000` | `#FFFFFF` | Texto principal |
| `textSecondary` | `#1A1A1A` | `#E8E8E8` | Subtítulos |
| `textTertiary` | `#2E2E2E` | `#D1D1D1` | Captions, metadata |
| `border` | `#E6E6E6` | `#262626` | Bordes principales |
| `borderSecondary` | `#D1D1D1` | `#333333` | Bordes secundarios |
| `error` | `#DC2626` | `#FF5252` | Errores |
| `success` | `#16A34A` | `#22C55E` | Éxito |

## Tipografía

Acceso vía `theme.typography.presets.*`:

| Preset | FontFamily | Size | Peculiaridad | Uso |
|---|---|---|---|---|
| `display` | `Rubik_900Black` | 56 | `tabular-nums` | Cronómetro |
| `h1` | `Rubik_700Bold` | 28 | – | Títulos principales |
| `h2` | `Rubik_700Bold` | 20 | – | Subtítulos |
| `h3` | `PlusJakartaSans_600SemiBold` | 16 | – | Etiquetas fuertes |
| `body` | `PlusJakartaSans_400Regular` | 14 | – | Lectura |
| `button` | `PlusJakartaSans_600SemiBold` | 15 | `uppercase` | Botones |
| `caption` | `PlusJakartaSans_500Medium` | 12 | – | Metadata |

## Espaciado

Acceso vía `theme.spacing(n)` = `n * 4px`. Usar siempre `theme.spacing(n)` en lugar de números mágicos.

## Uso en componentes

```tsx
import { StyleSheet } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

// Opción 1: inline (para estilos únicos)
function MyComponent() {
  const { theme } = useUnistyles();
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={[theme.typography.presets.body, { color: theme.colors.text }]}>
        Hola
      </Text>
    </View>
  );
}

// Opción 2: StyleSheet.create con tema (para estilos reutilizables)
const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing(4),
  },
  title: {
    ...theme.typography.presets.h2,
    color: theme.colors.text,
  },
}));
```

## Reglas de estilizado

- Los colores SOLO se modifican en `src/theme/index.ts`
- La tipografía SOLO se modifica en `src/theme/typography.ts`
- El espaciado SOLO se modifica en `src/theme/index.ts` (escala de 4)
- Los componentes NUNCA hardcodean `color`, `fontSize`, `fontFamily`, `fontWeight` ni valores de padding/margin
