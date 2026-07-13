import * as Notifications from 'expo-notifications';

const NOTIFICATION_ID = 'chaski-run';
const CHANNEL_ID = 'chaski-run-tracking';

function formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export async function setupNotificationChannel() {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Chaski Tracking',
        importance: Notifications.AndroidImportance.LOW,
        lightColor: '#19FA00',
        showBadge: false,
        vibrationPattern: [0],
    });
}

export async function updateNotification(elapsed: number, distanceMeters: number) {
    await Notifications.scheduleNotificationAsync({
        identifier: NOTIFICATION_ID,
        content: {
            title: 'Chaski en curso...',
            body: `${formatTime(elapsed)} · ${(distanceMeters / 1000).toFixed(2)} km`,
            color: '#19FA00',
            priority: Notifications.AndroidNotificationPriority.LOW,
        },
        trigger: { channelId: CHANNEL_ID },
    });
}

export async function cancelNotification() {
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID);
    await Notifications.dismissNotificationAsync(NOTIFICATION_ID);
}
