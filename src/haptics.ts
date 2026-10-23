import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// A touch the finger feels along with the icon it sees. Phones only.
const native = Platform.OS !== 'web';

export function tap(): void {
    if (native) void Haptics.selectionAsync();
}

export function success(): void {
    if (native) void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
