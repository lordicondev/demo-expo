import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { useTheme } from '@/theme';

/** A button with an icon (its children) and a label; `primary` in the brand's colour. */
export function Button({
    label,
    primary,
    children,
    ...props
}: PressableProps & { label: string; primary?: boolean; children?: ReactNode }) {
    const theme = useTheme();
    return (
        <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
                styles.button,
                primary
                    ? { backgroundColor: theme.brand }
                    : {
                          backgroundColor: theme.background,
                          borderColor: theme.border,
                          borderWidth: 1,
                      },
                (pressed || props.disabled) && styles.dim,
            ]}
            {...props}
        >
            {children}
            <Text style={[styles.label, { color: primary ? '#ffffff' : theme.text }]}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
    },
    dim: { opacity: 0.7 },
    label: { fontSize: 16, fontWeight: '600' },
});
