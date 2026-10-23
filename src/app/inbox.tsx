import { LordIcon } from '@lordicon/react-native';
import { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import checkCircle from '@/assets/icons/check-circle.json';
import download from '@/assets/icons/download.json';
import heart from '@/assets/icons/heart.json';
import star from '@/assets/icons/star.json';
import { useStore, type Notification } from '@/store';
import { useTheme } from '@/theme';

const ICONS: Record<Notification['kind'], object> = {
    liked: heart,
    shipped: download,
    delivered: checkCircle,
    review: star,
};

export default function Inbox() {
    const { notifications, readAll } = useStore();
    const theme = useTheme();

    // Opened: everything is read, and the bell in the header goes quiet.
    useEffect(readAll, [readAll]);

    return (
        <FlatList
            style={{ backgroundColor: theme.background }}
            contentContainerStyle={styles.list}
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
                <View style={[styles.row, { borderColor: theme.border }]}>
                    {/* Each icon enters once in view: the first ones one after another as the
                        screen opens, the rest as they scroll in. */}
                    <LordIcon
                        icon={ICONS[item.kind]}
                        intro={`in-reveal, delay=${index < 6 ? index * 120 : 0}`}
                        size={32}
                    />
                    <Text style={[styles.text, { color: theme.text }]}>{item.text}</Text>
                    <Text style={{ color: theme.textMuted }}>{item.time}</Text>
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    list: { paddingHorizontal: 16 },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    text: { flex: 1, fontSize: 15 },
});
