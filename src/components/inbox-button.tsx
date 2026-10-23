import { LordIcon } from '@lordicon/react-native';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import bell from '@/assets/icons/bell.json';
import { tap } from '@/haptics';
import { useStore } from '@/store';
import { useTheme } from '@/theme';

/** The bell in the header: the unread count as its value, so it rings when one comes. */
export function InboxButton() {
    const { unread } = useStore();
    const theme = useTheme();
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={unread ? `Inbox, ${unread} unread` : 'Inbox'}
            hitSlop={8}
            style={styles.button}
            onPress={() => {
                tap();
                router.push('/inbox');
            }}
        >
            <LordIcon icon={bell} value={unread} size={26} />
            {unread > 0 && (
                <Text style={[styles.badge, { backgroundColor: theme.brand }]}>{unread}</Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: { marginHorizontal: 16 },
    badge: {
        position: 'absolute',
        top: -4,
        right: -8,
        minWidth: 18,
        paddingHorizontal: 5,
        borderRadius: 9,
        overflow: 'hidden',
        color: '#ffffff',
        fontSize: 11,
        lineHeight: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
});
