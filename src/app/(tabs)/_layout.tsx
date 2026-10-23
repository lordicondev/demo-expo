import {
    LordIcon,
    useTabFocus,
    type FocusSource,
    type LordIconProps,
} from '@lordicon/react-native';
import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import { PlatformPressable } from 'expo-router/react-navigation';
import { Platform } from 'react-native';

import avatarCircle from '@/assets/icons/avatar-circle.json';
import cart from '@/assets/icons/cart.json';
import home from '@/assets/icons/home.json';
import magnifier from '@/assets/icons/magnifier.json';
import { useStore } from '@/store';
import { useTheme } from '@/theme';

// The home icon's morph goes there and back with no turning point in its file: `ratio` says
// where it turns, so the icon stays on its second look while the tab is chosen.
const TABS: { name: string; title: string; icon: object; trigger?: string }[] = [
    { name: 'index', title: 'Home', icon: home, trigger: 'follow(ratio=0.5)' },
    { name: 'search', title: 'Search', icon: magnifier },
    { name: 'cart', title: 'Cart', icon: cart },
    { name: 'profile', title: 'Profile', icon: avatarCircle },
];

// A tab's icon: to its second look while its tab is chosen.
function TabIcon({ navigation, ...props }: LordIconProps & { navigation: FocusSource }) {
    return <LordIcon {...props} state="morph-select" value={useTabFocus(navigation)} />;
}

export default function TabLayout() {
    const { count } = useStore();
    const theme = useTheme();
    return (
        <Tabs
            screenOptions={({ route, navigation }) => ({
                tabBarIcon: ({ color, size }) => {
                    const tab = TABS.find((item) => item.name === route.name)!;
                    return (
                        <TabIcon
                            icon={tab.icon}
                            trigger={tab.trigger}
                            navigation={navigation}
                            color={color}
                            size={size}
                        />
                    );
                },
                // On Android the tab's ripple would wash over the icon.
                tabBarButton: (props) => <PlatformPressable {...props} pressColor="transparent" />,
            })}
            screenListeners={{
                tabPress: () => {
                    if (Platform.OS !== 'web') void Haptics.selectionAsync();
                },
            }}
        >
            {TABS.map((tab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        title: tab.title,
                        tabBarBadge: tab.name === 'cart' && count ? count : undefined,
                        // Not the brand's green: the chosen tab's icon has it, and they would merge.
                        tabBarBadgeStyle: { backgroundColor: theme.badge, color: theme.onBadge },
                    }}
                />
            ))}
        </Tabs>
    );
}
