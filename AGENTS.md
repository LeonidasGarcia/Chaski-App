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
- **Importante:** El value del context debe envolverse en `useMemo([db])` para evitar re-renders innecesarios y efectos infinitos en consumidores

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

### routePointsRepository (sin FK, tabla temporal)

Tabla sin FK ni relaciones. Se limpia al detener/resetear carrera. Usada exclusivamente por background tracking.

| Método | Descripción |
|--------|-------------|
| `getAll()` | `Promise<RoutePointRepository[]>` ordenado por timestamp |
| `insert(point)` | Inserta 1 punto GPS filtrado |
| `deleteAll()` | `DELETE FROM route_points` (limpia sesión) |

## Tipos principales

### `src/types/database.ts`
- `UserProfileRepository`, `RunRepository`, `ChallengeRepository`, `RoutePointRepository`
- `CreateUserProfile`, `CreateRun`, `CreateChallenge`, `CreateRoutePoint`
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

- `react-native-unistyles@3.2.5` para `StyleSheet.configure()`, `StyleSheet.create(theme => ...)` y `UnistylesRuntime.setTheme()`
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
|---|---|---|---|---|
| `primary` | `#19FA00` | `#19FA00` | Botones, acentos, display |
| `onPrimary` | `#000000` | `#000000` | Texto sobre fondo primary |
| `background` | `#FFFFFF` | `#000000` | Fondo de pantallas |
| `surface` | `#F7F7F7` | `#0F0F0F` | Tarjetas, contenedores |
| `surfaceSecondary` | `#F0F0F0` | `#1A1A1A` | Secondary cards |
| `text` | `#000000` | `#FFFFFF` | Texto principal |
| `textSecondary` | `#1A1A1A` | `#E8E8E8` | Subtítulos |
| `textTertiary` | `#2E2E2E` | `#D1D1D1` | Captions, metadata |
| `border` | `#E6E6E6` | `#262626` | Bordes principales |
| `borderSecondary` | `#D1D1D1` | `#333333` | Bordes secundarios |
| `error` | `#DC2626` | `#FF5252` | Errores |
| `onError` | `#FFFFFF` | `#FFFFFF` | Texto sobre fondo error |
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

## Border Radius

Acceso vía `theme.borderRadius.*`:

| Token | Valor | Uso |
|---|---|---|
| `sm` | 8 | Overlays pequeños (timer en mapa) |
| `md` | 12 | Inputs, botones, tarjetas |
| `lg` | 20 | Botones redondos del mapa |
| `xl` | 30 | Botón start/stop, permission gate |

## Acceso al tema

**Importante:** `useUnistyles()` de Unistyles v3 tiene una proxy que no propaga cambios de tema. En su lugar, usamos un hook propio:

```tsx
import { useAppTheme } from '@/lib/useAppTheme';

function MyComponent() {
  const theme = useAppTheme();
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={[theme.typography.presets.body, { color: theme.colors.text }]}>
        Hola
      </Text>
    </View>
  );
}
```

`useAppTheme()` lee `UnistylesRuntime.themeName` y retorna `lightTheme` o `darkTheme` (objetos planos, no proxies). El re-render se forza vía `ThemeContext` (ver sección abajo).

`StyleSheet.create(theme => ...)` con el plugin babel de Unistyles sigue funcionando para estilos reutilizables.

## Reglas de estilizado

- Los colores SOLO se modifican en `src/theme/index.ts`
- La tipografía SOLO se modifica en `src/theme/typography.ts`
- El espaciado SOLO se modifica en `src/theme/index.ts` (escala de 4)
- Los componentes NUNCA hardcodean `color`, `fontSize`, `fontFamily`, `fontWeight` ni valores de padding/margin

## ThemeContext

`src/context/ThemeContext.tsx` — React Context que fuerza re-render global cuando cambia el tema:

| Export | Tipo | Rol |
|---|---|---|
| `ThemeVersionProvider` | Componente | Provee `version` via context. Envuelve el app en `_layout.tsx` |
| `useThemeVersion()` | Hook | Retorna `number` (contador de versión). Cada cambio incremeta → re-render |
| `bumpThemeVersion()` | Función plana | Incrementa el contador. Usable desde código no-React |

**Puente global:** `let _bump: (() => void) | null = null` se asigna al montar el Provider. `bumpThemeVersion()` lo llama con `_bump?.()`. Mismo patrón que `navigationRef`.

## Theme toggle

- `adaptiveThemes: false` en `StyleSheet.configure()` en `src/theme/index.ts`
- `src/lib/theme.ts` → `applyThemePreference(theme: ThemePreference)` función plana (no hook) que encapsula el toggle. SYSTEM: lee `Appearance.getColorScheme()` y llama `setTheme()` directamente. LIGHT/DARK: llama `setTheme()` directamente. Finalmente llama `bumpThemeVersion()` desde `ThemeContext`.
- `src/lib/useAppTheme.ts` → hook `useAppTheme()` que retorna tema fresco vía `getActiveTheme()`, forzando re-render con `useThemeVersion()`
- `src/lib/theme.ts` → `applyThemePreference()` llama `bumpThemeVersion()` tras `setTheme()`
- `useApplyThemePreference` en `(tabs)/_layout.tsx` restaura tema guardado al montar tabs. Usa `useRef` para subscription + `useThemeVersion()` como dependencia para re-evaluar cuando el usuario cambia preferencia. `initialRef` evita loop infinito con `bumpThemeVersion()`. No llamar `UnistylesRuntime.setTheme()` a nivel de módulo — causa `bad_optional_access`.
- El listener de SYSTEM también llama `bumpThemeVersion()` tras `setTheme()`
- No se usa `setAdaptiveThemes()` para evitar race conditions nativas
- Se usa desde:
  - `onboarding` → al seleccionar tema en el formulario
  - `settings/hooks/useThemeToggle` → al cambiar en Ajustes
  - `settings/hooks/useApplyThemePreference` → al restaurar el tema guardado al montar tabs

# Feature Architecture

## Stack

- `react-hook-form@7.80` + `@hookform/resolvers@5.4` + `zod@4.4`
- Unistyles para estilos, expo-router para navegación

## Estructura de una feature

Cada feature vive en `src/features/<nombre>/` con esta estructura:

```
src/features/onboarding/
├── constants/index.ts        → Opciones de chips, strings
├── guards/useOnboardingGuard.ts  → Guard de navegación (redirect si no hay perfil)
├── hooks/useOnboardingForm.ts    → Hook con lógica del formulario
├── schemas/onboarding.ts         → Schema zod + tipo inferido
└── screens/OnboardingScreen.tsx  → Screen con Controllers + UI
```

## Responsabilidades

| Carpeta | Rol |
|---|---|
| `constants/` | Datos planos tipados (opciones, labels) |
| `guards/` | Hooks que interceptan navegación (redirect condicional) |
| `hooks/` | Lógica de feature reusable (formularios, fetching) |
| `schemas/` | Schemas zod + tipos inferidos |
| `screens/` | Componente de pantalla (solo Controllers + UI) |

## Convenciones

- **Route files** en `src/app/` solo re-exportan el screen: `export { default } from '@/features/.../screens/...'`
- **Guard** se usa en el screen destino para redirect condicional (ej: home usa `useOnboardingGuard`)
- **Hook** extrae `useForm`, submit, y conexión a BD. El screen no llama `useForm` directamente
- **Schema** separa validación del screen: facilita reuso y testing
- **Constants** evita magic strings/arrays dentro del screen
- **zod v4**: usar `{ message: '...' }` en lugar de `invalid_type_error`/`required_error`; agregar `as const` en `z.enum()`
- **Resolver**: `zodResolver(schema as any)` por incompatibilidad de tipos entre `zod/v4/classic` y `zod/v4/core`

## Manejo de errores en promesas DB

Siempre agregar `.catch(() => setLoading(false))` en promesas de BD dentro de hooks (`userProfile.get()`, etc.) para evitar estado `loading = true` eterno si la promesa rechaza.

## Componentes compartidos

En `src/components/`:

| Componente | Props clave |
|---|---|
| `ScreenContainer` | `children` — KeyboardAvoidingView + ScrollView |
| `InputField` | `label`, `value`, `onChangeText`, `keyboardType?`, `error?` |
| `NumericInputField` | `label`, `value`, `onChange`, `keyboardType?`, `error?` — usa string interno para permitir limpiar el input |
| `ChipSelector` | `label`, `options: ChipOption[]`, `selected`, `onSelect`, `error?` |
| `Button` | `title`, `onPress`, `disabled?` |
| `SectionCard` | `title`, `children` — tarjeta con título y contenido |
| `MetricRow` | `label`, `value` — fila label + valor para métricas |

## Features existentes

### onboarding

```
src/features/onboarding/
├── guards/useOnboardingGuard.ts       → Redirect si no hay perfil
├── hooks/useOnboardingForm.ts         → useForm + submit con upsert
├── schemas/onboarding.ts              → Schema zod con theme_preference
└── screens/OnboardingScreen.tsx       → Formulario completo + applyThemePreference al seleccionar tema
```

#### Flujo

1. `index.tsx` monta → `useOnboardingGuard()` ejecuta `userProfile.get()`
2. Si no hay perfil → `router.replace('/onboarding')`
3. `OnboardingScreen` renderiza con `useOnboardingForm()`. Tema se aplica visualmente al seleccionar via `applyThemePreference()`
4. Submit → `userProfile.upsert()` con `id=1` → `router.replace('/')`
5. Al volver a home, `useOnboardingGuard` encuentra el perfil y redirige a `/(tabs)/profile`

### profile

```
src/features/profile/
├── hooks/useProfile.ts                → Fetch con useFocusEffect (refresca al enfocar)
├── hooks/useProfileForm.ts            → useForm prepoblado + upsert preservando theme_preference actual
├── schemas/profile.ts                 → Schema zod sin theme_preference
└── screens/
    ├── ProfileScreen.tsx               → Métricas de salud (IMC, FC, BMR, etc.)
    └── EditProfileScreen.tsx           → Formulario de edición (sin selector de tema)
```

### settings

```
src/features/settings/
├── hooks/useThemeToggle.ts              → Lee preferencia de BD + applyThemePreference
├── hooks/useApplyThemePreference.ts     → Restaura tema guardado al montar tabs
└── screens/SettingsScreen.tsx           → ChipSelector LIGHT/DARK/SYSTEM
```

#### Theme toggle desde settings

- `useThemeToggle` lee `theme_preference` de BD, expone `updateTheme()` que persiste en BD + llama `applyThemePreference()`
- `useApplyThemePreference` se ejecuta en `(tabs)/_layout.tsx` para restaurar el tema guardado al iniciar
- El perfil de BD y el toggle de tema están separados: editar perfil NO modifica el tema

### run

```
src/features/run/
├── constants/mapStyle.ts       → customMapStyle JSON (oculta buildings/POIs/transit/terrain)
├── hooks/useRunTracking.ts     → Background + foreground GPS tracking con filtros y re-sync
├── hooks/useCurrentPosition.ts → Watcher independiente para marcador en vivo
├── lib/runTrackingTask.ts      → TaskManager.defineTask para background tracking
└── screens/
    ├── MapScreen.tsx            → MapView con Polyline, timer, start/stop, locate button
    └── RunScreen.tsx            → Pantalla previa al mapa con botón "Abrir mapa"
```

### Excepciones documentadas

- `MapScreen.tsx`: tres usos de `rgba(0,0,0,0.5)` y `rgba(0,0,0,0.6)` en overlays sobre el mapa nativo (back button, timer, locate button). La transparencia es necesaria para no bloquear la vista del mapa. No hay tokens de tema equivalentes.
- `MapScreen.tsx`: `color: '#FFFFFF'` en textos e iconos sobre esos overlays rgba (back arrow, timer/distance/speed, locate icon). Están atados a los overlays y no tienen token de tema.
- `MapScreen.tsx`: `borderColor: '#FFFFFF'` en el marker verde. Es un borde blanco sobre el mapa nativo para contraste visual. No hay token de tema equivalente.

# Background Tracking

## Stack

- `expo-task-manager@56.0.19` para `defineTask`
- `expo-location@56.0.18` con `startLocationUpdatesAsync` / `stopLocationUpdatesAsync`
- `expo-sqlite@~56.0.5` con `SQLite.openDatabaseAsync()` para conexión propia desde el task (fuera de React)
- `isAndroidBackgroundLocationEnabled: true` en `app.json` (solo el usuario hace builds)

## Arquitectura

- El **background task** (`defineTask`) es el único escritor a la tabla `route_points`. Corre siempre que hay tracking activo (foreground y background).
- El **foreground watcher** (`watchPositionAsync`) solo actualiza React state para la UI en tiempo real. No escribe a DB.
- Al volver de background, `AppState` listener dispara `reSyncFromDb()` que lee todos los puntos de `route_points`, recalcula distancia y reemplaza el estado de React.

```
COMENZAR → deleteAll() + resetRunTrackingState() + foreground watcher + background task
GPS tick → foreground: React state (UI) | background: INSERT a route_points (único escritor)
BACKGROUND → foreground congelado, background sigue insertando
VOLVER    → AppState 'active' → lastCoordRef = null → reSyncFromDb() → Polyline completa
DETENER   → stopLocationUpdates + stopWatcher + deleteAll() + reset React state
```

## Filtros GPS (iguales en foreground y background)

| Filtro | Valor | Efecto |
|--------|-------|--------|
| `MAX_ACCURACY` | 25m | Puntos con accuracy mayor se descartan |
| `OUTLIER_THRESHOLD` | 80m | Saltos mayores a 80m se descartan (GPS errático) |
| `MIN_DISTANCE` | 2m | Puntos a menos de 2m del anterior se descartan (estático) |

## `timeInterval` y frecuencia de UI

- `timeInterval: 500` en ambos watchers (foreground y background)
- El Polyline se actualiza cada ~0.5s en lugar de 1s → línea más fluida
- El filtro de 2m evita saturar la Polyline con puntos duplicados cuando el usuario está quieto
- Timer de cuenta regresiva sigue en 1s (`setInterval(1000)`)

## Archivos clave

| Archivo | Rol |
|---|---|
| `src/features/run/lib/runTrackingTask.ts` | `defineTask('BACKGROUND_RUN_TRACKING', ...)` — módulo-level, conexión propia SQLite, filtros, `resetRunTrackingState()` |
| `src/features/run/hooks/useRunTracking.ts` | Hook principal: `start()`, `stop()`, `reset()`, `reSyncFromDb()`, AppState listener |
| `src/db/repositories/routePointsRepository.ts` | Factory: `getAll()`, `insert()`, `deleteAll()` |
| `src/types/database.ts` | `RoutePointRepository`, `CreateRoutePoint` |
| `src/db/database.ts` | Migration v2 — tabla `route_points` (DATABASE_VERSION = 2) |

## Consideraciones importantes

- **`defineTask` no `TaskManager.defineTask`**: el import correcto es `import { defineTask } from 'expo-task-manager'`. `TaskManager` no es un export.
- **Conexión propia SQLite**: el background task abre su propia conexión con `SQLite.openDatabaseAsync('chaski.db')`. No puede usar `useSQLiteContext` (fuera de React).
- **`lastCoordRef` reset en re-sync**: al volver de background se setea `lastCoordRef.current = null` para evitar que el primer GPS sea filtrado como outlier.
- **Puntos huérfanos**: si el usuario cierra la app durante una carrera, los puntos quedan en `route_points`. Se limpian con `deleteAll()` al próximo `start()`.
- **Builds**: solo el usuario ejecuta `eas build`. Nunca correr builds desde el asistente.

## Critical Context (adicional)

- `timeInterval: 500` + `distanceInterval: 0` + `Accuracy.High` en foreground y background.
- Filtro de distancia mínima de 2m evita puntos redundantes cuando el usuario está quieto.
- El foreground watcher NO escribe a DB para evitar duplicados con el background task.
- `reSyncFromDb()` recalcula distancia total con haversine sobre todos los puntos de DB.
- `AppState.addEventListener('change', ...)` con cleanup de subscription en `useEffect`.
- `resetRunTrackingState()` resetea `lastPoint` interno del background task para evitar outliers falsos entre carreras.
