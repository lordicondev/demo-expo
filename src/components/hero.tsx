import { LordIcon, type LordIconHandle } from '@lordicon/react-native';
import * as Clipboard from 'expo-clipboard';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import copy from '@/assets/icons/copy.json';
import piggyBank from '@/assets/icons/piggy-bank.json';
import { tap } from '@/haptics';
import { useTheme } from '@/theme';

const CODE = 'HELLO20';

/**
 * The offer at the top of the home screen. The piggy bank enters with the screen, then a coin
 * drops in now and then: its default state, looped with a rest. A tap on the code copies it.
 */
export function Hero() {
    const theme = useTheme();
    const copyIcon = useRef<LordIconHandle>(null);
    const [copied, setCopied] = useState(false);

    return (
        <View style={[styles.hero, { backgroundColor: theme.brand }]}>
            <View style={styles.text}>
                <Text style={styles.kicker}>THIS WEEK</Text>
                <Text style={styles.title}>20% off your first order</Text>
                {/* Copy and say so: the icon plays from onPress. */}
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Copy the code ${CODE}`}
                    style={({ pressed }) => [styles.code, pressed && styles.pressed]}
                    onPress={() => {
                        tap();
                        void Clipboard.setStringAsync(CODE);
                        void copyIcon.current?.play();
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                    }}
                >
                    <LordIcon ref={copyIcon} icon={copy} color="#ffffff" size={18} />
                    <Text style={styles.codeText}>{copied ? 'Copied' : CODE}</Text>
                </Pressable>
            </View>
            <LordIcon
                icon={piggyBank}
                intro="in-reveal"
                trigger="loop(2500)"
                color="#ffffff"
                size={104}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    hero: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 24,
        paddingLeft: 20,
        paddingRight: 12,
        borderRadius: 20,
        marginBottom: 4,
    },
    text: { flex: 1, alignItems: 'flex-start', gap: 8 },
    kicker: { color: '#ffffff', opacity: 0.8, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
    title: { color: '#ffffff', fontSize: 22, fontWeight: '800', lineHeight: 27 },
    code: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'rgba(255, 255, 255, 0.7)',
    },
    pressed: { opacity: 0.7 },
    codeText: { color: '#ffffff', fontSize: 15, fontWeight: '700', letterSpacing: 1 },
});
