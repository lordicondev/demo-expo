import { LordIcon, type LordIconHandle } from '@lordicon/react-native';
import { Tabs } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

import heart from '@/assets/icons/heart.json';
import shoppingBasket from '@/assets/icons/shopping-basket.json';
import { Hero } from '@/components/hero';
import { InboxButton } from '@/components/inbox-button';
import { Toast } from '@/components/toast';
import { tap } from '@/haptics';
import { price, PRODUCTS, useStore, type Product } from '@/store';
import { useTheme } from '@/theme';

export default function Home() {
    const { receive } = useStore();
    const theme = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const [added, setAdded] = useState<{ key: number; name: string } | null>(null);
    const hide = useRef<ReturnType<typeof setTimeout>>(undefined);

    // Added to the cart: a toast for a moment, a new one for each add.
    const showAdded = (name: string) => {
        clearTimeout(hide.current);
        setAdded((last) => ({ key: (last?.key ?? 0) + 1, name }));
        hide.current = setTimeout(() => setAdded(null), 1800);
    };

    // Pull down: the list refreshes, and a notification comes in: the bell rings.
    const refresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            receive();
            setRefreshing(false);
        }, 1200);
    };

    return (
        <>
            <Tabs.Screen options={{ headerRight: () => <InboxButton /> }} />
            <FlatList
                style={{ backgroundColor: theme.background }}
                contentContainerStyle={styles.list}
                data={PRODUCTS}
                keyExtractor={(product) => product.id}
                ListHeaderComponent={Hero}
                renderItem={({ item }) => (
                    <ProductCard product={item} onAdd={() => showAdded(item.name)} />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refresh}
                        colors={[theme.brand]}
                        tintColor={theme.brand}
                    />
                }
            />
            {added && <Toast key={added.key} text={`${added.name} added to the cart`} />}
        </>
    );
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: () => void }) {
    const { add, liked, toggleLike } = useStore();
    const theme = useTheme();
    const basket = useRef<LordIconHandle>(null);
    const isLiked = liked.has(product.id);

    return (
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Text style={[styles.name, { color: theme.text }]}>{product.name}</Text>
            <Text style={{ color: theme.textMuted }}>{product.detail}</Text>
            <View style={styles.bottom}>
                <Text style={[styles.price, { color: theme.text }]}>{price(product.price)}</Text>
                {/* Liked or not is a state of the app: the heart follows it. */}
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={isLiked ? 'Unlike' : 'Like'}
                    style={({ pressed }) => [
                        styles.action,
                        { borderColor: theme.border, borderWidth: 1 },
                        pressed && styles.pressed,
                    ]}
                    onPress={() => {
                        tap();
                        toggleLike(product.id);
                    }}
                >
                    <LordIcon
                        icon={heart}
                        state="morph-select"
                        value={isLiked}
                        color={isLiked ? theme.brand : undefined}
                        size={22}
                    />
                </Pressable>
                {/* A tap of a button: the basket plays from its onPress. */}
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Add ${product.name} to the cart`}
                    style={({ pressed }) => [
                        styles.action,
                        { backgroundColor: theme.brand },
                        pressed && styles.pressed,
                    ]}
                    onPress={() => {
                        tap();
                        void basket.current?.play({ state: 'hover-add' });
                        add(product.id);
                        onAdd();
                    }}
                >
                    <LordIcon ref={basket} icon={shoppingBasket} color="#ffffff" size={22} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    list: { padding: 16, gap: 12, paddingBottom: 80 },
    card: { gap: 2, padding: 16, borderRadius: 16 },
    name: { fontSize: 17, fontWeight: '600' },
    bottom: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
    price: { flex: 1, fontSize: 16, fontWeight: '700' },
    action: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pressed: { opacity: 0.7 },
});
