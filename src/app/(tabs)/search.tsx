import { LordIcon } from '@lordicon/react-native';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import crossCircle from '@/assets/icons/cross-circle.json';
import cross from '@/assets/icons/cross.json';
import magnifier from '@/assets/icons/magnifier.json';
import { price, PRODUCTS } from '@/store';
import { useTheme } from '@/theme';

export default function Search() {
    const theme = useTheme();
    const [focused, setFocused] = useState(false);
    const [query, setQuery] = useState('');
    const found = PRODUCTS.filter((product) =>
        `${product.name} ${product.detail}`.toLowerCase().includes(query.trim().toLowerCase()),
    );

    return (
        <View style={[styles.page, { backgroundColor: theme.background }]}>
            <View
                style={[
                    styles.field,
                    {
                        backgroundColor: theme.surface,
                        borderColor: focused ? theme.textMuted : theme.border,
                    },
                ]}
            >
                {/* Focus and text are states of the field: the icons follow them. */}
                <LordIcon icon={magnifier} value={focused} size={24} />
                <TextInput
                    style={[styles.input, { color: theme.text }]}
                    value={query}
                    onChangeText={setQuery}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="Search products"
                    placeholderTextColor={theme.textMuted}
                    returnKeyType="search"
                />
                <Pressable
                    accessibilityLabel="Clear"
                    hitSlop={8}
                    disabled={!query}
                    onPress={() => setQuery('')}
                    style={{ opacity: query ? 1 : 0 }}
                >
                    <LordIcon icon={cross} state="in-reveal" value={query !== ''} size={20} />
                </Pressable>
            </View>
            <FlatList
                data={found}
                keyExtractor={(product) => product.id}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                    <View style={styles.empty}>
                        {/* Enters each time the results run out. */}
                        <LordIcon icon={crossCircle} intro="in-reveal" size={48} />
                        <Text style={{ color: theme.textMuted }}>Nothing matches “{query}”.</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={[styles.row, { borderColor: theme.border }]}>
                        <View style={styles.text}>
                            <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
                            <Text style={{ color: theme.textMuted }}>{item.detail}</Text>
                        </View>
                        <Text style={{ color: theme.text }}>{price(item.price)}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    page: { flex: 1, padding: 16, gap: 8 },
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        borderWidth: 1,
    },
    // The field's border shows the focus: no outline of the browser's on the web.
    input: { flex: 1, paddingVertical: 12, fontSize: 16, outlineStyle: 'solid', outlineWidth: 0 },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    text: { flex: 1, gap: 2 },
    name: { fontSize: 16, fontWeight: '600' },
    empty: { alignItems: 'center', gap: 12, paddingVertical: 32 },
});
