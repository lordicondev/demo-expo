import { LordIcon, type LordIconHandle } from '@lordicon/react-native';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import cart from '@/assets/icons/cart.json';
import confetti from '@/assets/icons/confetti.json';
import creditCard from '@/assets/icons/credit-card.json';
import spinnerCircle from '@/assets/icons/spinner-circle.json';
import trashBin from '@/assets/icons/trash-bin.json';
import { Button } from '@/components/button';
import { useVisit } from '@/entrance';
import { success, tap } from '@/haptics';
import { price, productOf, useStore, type CartLine } from '@/store';
import { useTheme } from '@/theme';

export default function Cart() {
    const { cart: lines, clearCart } = useStore();
    const theme = useTheme();
    const [stage, setStage] = useState<'shopping' | 'paying' | 'done'>('shopping');

    const checkout = () => {
        tap();
        setStage('paying');
        setTimeout(() => {
            clearCart();
            setStage('done');
            success();
        }, 2000); // the payment
    };

    // Placed: the message stays until something new goes into the cart.
    if (stage === 'done' && !lines.length) {
        return (
            <Message
                icon={confetti}
                color={theme.brand}
                title="Order placed"
                text="We will let you know when it is on its way."
                action="Continue shopping"
                onAction={() => {
                    setStage('shopping');
                    router.navigate('/');
                }}
            />
        );
    }
    if (!lines.length) {
        return (
            <Message
                icon={cart}
                title="Your cart is empty"
                text="Add something you like from the home screen."
                action="Browse"
                onAction={() => router.navigate('/')}
            />
        );
    }

    const total = lines.reduce((sum, line) => sum + productOf(line.id).price * line.quantity, 0);
    return (
        <View style={[styles.page, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.list}>
                {lines.map((line) => (
                    <CartRow key={line.id} line={line} />
                ))}
            </ScrollView>
            <View style={[styles.footer, { borderColor: theme.border }]}>
                <View style={styles.total}>
                    <Text style={{ color: theme.textMuted }}>Total</Text>
                    <Text style={[styles.amount, { color: theme.text }]}>{price(total)}</Text>
                </View>
                <Button
                    primary
                    label={stage === 'paying' ? 'Paying…' : `Pay ${price(total)}`}
                    disabled={stage === 'paying'}
                    onPress={checkout}
                >
                    {/* The card, then a loop while the payment runs. */}
                    {stage === 'paying' ? (
                        <LordIcon
                            icon={spinnerCircle}
                            state="loop-snake-alt"
                            trigger="loop"
                            color="#ffffff"
                            size={22}
                        />
                    ) : (
                        <LordIcon icon={creditCard} color="#ffffff" size={22} />
                    )}
                </Button>
            </View>
        </View>
    );
}

function CartRow({ line }: { line: CartLine }) {
    const { add, decrease, remove } = useStore();
    const theme = useTheme();
    const bin = useRef<LordIconHandle>(null);
    const product = productOf(line.id);
    const last = line.quantity === 1;

    return (
        <View style={[styles.row, { borderColor: theme.border }]}>
            <View style={styles.text}>
                <Text style={[styles.name, { color: theme.text }]}>{product.name}</Text>
                <Text style={{ color: theme.textMuted }}>
                    {price(product.price * line.quantity)}
                </Text>
            </View>
            {/* The bin plays first, then the line goes: play() resolves at the end. */}
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove ${product.name}`}
                hitSlop={8}
                onPress={async () => {
                    tap();
                    if (await bin.current?.play()) remove(line.id);
                }}
            >
                <LordIcon ref={bin} icon={trashBin} size={24} />
            </Pressable>
            <View style={[styles.stepper, { borderColor: theme.border }]}>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="One fewer"
                    disabled={last}
                    style={[styles.step, last && styles.off]}
                    onPress={() => {
                        tap();
                        decrease(line.id);
                    }}
                >
                    <Text style={[styles.sign, { color: theme.text }]}>−</Text>
                </Pressable>
                <Text style={[styles.quantity, { color: theme.text }]}>{line.quantity}</Text>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="One more"
                    style={styles.step}
                    onPress={() => {
                        tap();
                        add(line.id);
                    }}
                >
                    <Text style={[styles.sign, { color: theme.text }]}>+</Text>
                </Pressable>
            </View>
        </View>
    );
}

function Message(props: {
    icon: object;
    color?: string;
    title: string;
    text: string;
    action: string;
    onAction: () => void;
}) {
    const theme = useTheme();
    // It enters each time the screen shows: a new key mounts it anew.
    const visit = useVisit();
    return (
        <View style={[styles.message, { backgroundColor: theme.background }]}>
            <LordIcon
                key={visit}
                icon={props.icon}
                intro="in-reveal"
                color={props.color}
                size={72}
            />
            <Text style={[styles.title, { color: theme.text }]}>{props.title}</Text>
            <Text style={[styles.body, { color: theme.textMuted }]}>{props.text}</Text>
            <Button label={props.action} onPress={props.onAction} />
        </View>
    );
}

const styles = StyleSheet.create({
    page: { flex: 1 },
    list: { paddingHorizontal: 16 },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    text: { flex: 1, gap: 2 },
    name: { fontSize: 16, fontWeight: '600' },
    stepper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 20 },
    step: { width: 40, height: 36, alignItems: 'center', justifyContent: 'center' },
    sign: { fontSize: 20, fontWeight: '500' },
    off: { opacity: 0.3 },
    quantity: { minWidth: 20, textAlign: 'center', fontSize: 16, fontWeight: '600' },
    footer: { gap: 12, padding: 16, borderTopWidth: StyleSheet.hairlineWidth },
    total: { flexDirection: 'row', justifyContent: 'space-between' },
    amount: { fontSize: 18, fontWeight: '700' },
    message: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32 },
    title: { fontSize: 20, fontWeight: '700' },
    body: { textAlign: 'center', marginBottom: 8 },
});
