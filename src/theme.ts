import { useColorScheme } from 'react-native';

// Neutral greys and the Lordicon green, in light and dark.
const light = {
    text: '#0a0b0e',
    textSoft: '#565c68',
    textMuted: '#767c89',
    background: '#ffffff',
    surface: '#f7f8fa',
    border: '#dee1e6',
    brand: '#08c18a',
    brandSurface: '#e6f8f1',
    /** A count on a tab: calm next to the chosen tab's green. */
    badge: '#9ba1ad',
    onBadge: '#ffffff',
};

const dark: typeof light = {
    text: '#f7f8fa',
    textSoft: '#c3c7d0',
    textMuted: '#9ba1ad',
    background: '#0a0b0e',
    surface: '#1b1d22',
    border: '#2c2f36',
    brand: '#08c18a',
    brandSurface: '#0d2e24',
    badge: '#c3c7d0',
    onBadge: '#0a0b0e',
};

export type Theme = typeof light;

export function useTheme(): Theme {
    return useColorScheme() === 'dark' ? dark : light;
}
