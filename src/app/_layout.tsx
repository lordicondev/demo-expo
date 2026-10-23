import { LordIconProvider } from '@lordicon/react-native';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { StoreProvider } from '@/store';
import { useTheme } from '@/theme';

export default function RootLayout() {
    const dark = useColorScheme() === 'dark';
    const theme = useTheme();
    const navigation = dark ? DarkTheme : DefaultTheme;

    return (
        // Every icon in the app in the theme's text colour, unless it has its own. On the web,
        // the engine's files are where lordicon-assets copied them (see package.json).
        <LordIconProvider color={theme.text} assets="/lordicon/">
            <StoreProvider>
                <ThemeProvider
                    value={{
                        ...navigation,
                        colors: {
                            ...navigation.colors,
                            primary: theme.brand,
                            background: theme.background,
                            card: theme.background,
                            text: theme.text,
                            border: theme.border,
                        },
                    }}
                >
                    <Stack>
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="inbox" options={{ title: 'Inbox' }} />
                    </Stack>
                    <StatusBar style={dark ? 'light' : 'dark'} />
                </ThemeProvider>
            </StoreProvider>
        </LordIconProvider>
    );
}
