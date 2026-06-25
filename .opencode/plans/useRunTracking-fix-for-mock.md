# Fix useRunTracking for Mock GPS compatibility

## Problem
Mock GPS does not inject sensor data (accelerometer, gyroscope). `BestForNavigation` expects these extra sensors and may ignore/delay mock updates. Additionally, `distanceInterval: 3` causes the OS to filter positions that don't exceed 3m movement threshold.

Meanwhile `useCurrentPosition` works fine with `Accuracy.High` and `distanceInterval: 0`.

## Change needed in `src/features/run/hooks/useRunTracking.ts`

Line 60-64: Change watchPositionAsync options from:
```ts
{
    timeInterval: 1000,
    distanceInterval: MIN_DISTANCE_METERS,
    accuracy: Location.Accuracy.BestForNavigation,
}
```
To:
```ts
{
    timeInterval: 1000,
    distanceInterval: 0,
    accuracy: Location.Accuracy.High,
}
```

## Reasoning
| Option | Actual | Nueva | Razón |
|---|---|---|---|
| `accuracy` | `BestForNavigation` (nivel 6) | `High` (nivel 4) | Compatible con mock; igual preciso para running con GPS real |
| `distanceInterval` | `MIN_DISTANCE_METERS (3)` | `0` | OS no filtra nada, todos los updates llegan |
| Filtro haversine en callback | `3m` | Se mantiene igual | Sigue protegiendo de ruido GPS en la ruta |

## Future consideration
For real-world use (no mock), switch back to `BestForNavigation` for maximum precision.
