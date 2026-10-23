import { LordIcon } from '@lordicon/react-native';
import { StyleSheet, Text, View } from 'react-native';

import checkCircle from '@/assets/icons/check-circle.json';
import { useTheme } from '@/theme';

/** A short message at the bottom; its tick enters as it shows. A new key shows it again. */
export function Toast(props: { text: string }) {
    const theme = useTheme();
    return (
        <View pointerEvents="none" style={styles.place}>
            <View style={[styles.toast, { backgroundColor: theme.text }]}>
                <LordIcon icon={checkCircle} intro="in-reveal" color={theme.background} size={24} />
                <Text style={[styles.text, { color: theme.background }]}>{props.text}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    place: { position: 'absolute', left: 16, right: 16, bottom: 16, alignItems: 'center' },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 14,
    },
    text: { fontSize: 15, fontWeight: '600' },
});
