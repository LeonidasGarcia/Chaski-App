import type { MapStyleElement } from 'react-native-maps';

export const MAP_STYLE: MapStyleElement[] = [
    { featureType: 'building', stylers: [{ visibility: 'off' }] },
    { featureType: 'building.3d', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'road.arterial', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'road.highway', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'landscape.natural.terrain', stylers: [{ visibility: 'off' }] },
];
