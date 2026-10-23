// The app's state: products, the cart, liked products and notifications, in one context. A
// real app would keep them on a server; the icons only show them.
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export interface Product {
    id: string;
    name: string;
    detail: string;
    price: number;
}

export const PRODUCTS: Product[] = [
    { id: 'lamp', name: 'Desk lamp', detail: 'Warm light, dimmable', price: 64 },
    { id: 'notebook', name: 'Dot notebook', detail: 'A5, 120 pages', price: 12 },
    { id: 'mug', name: 'Ceramic mug', detail: 'Stoneware, 350 ml', price: 18 },
    { id: 'mic', name: 'USB microphone', detail: 'For calls and podcasts', price: 89 },
    { id: 'gift', name: 'Gift card', detail: 'Any amount, never expires', price: 25 },
    { id: 'puzzle', name: 'Jigsaw puzzle', detail: '1000 pieces, a city map', price: 21 },
    { id: 'planner', name: 'Habit planner', detail: 'A year of weekly charts', price: 16 },
    { id: 'clock', name: 'Desk clock', detail: 'Silent, wooden frame', price: 34 },
    { id: 'tools', name: 'Mini toolkit', detail: '24 bits, steel case', price: 29 },
    { id: 'notes', name: 'Sticky notes', detail: '6 colours, 600 sheets', price: 7 },
    { id: 'keyring', name: 'Keyring', detail: 'Brass, with a hook', price: 11 },
    { id: 'lockbox', name: 'Lock box', detail: 'For keys and cards', price: 38 },
    { id: 'cards', name: 'Greeting cards', detail: 'Set of 8, with envelopes', price: 14 },
    { id: 'plant', name: 'Small plant', detail: 'Pothos in a clay pot', price: 22 },
    { id: 'bottle', name: 'Water bottle', detail: 'Steel, 750 ml', price: 26 },
    { id: 'drive', name: 'Backup drive', detail: '2 TB, USB-C', price: 79 },
    { id: 'frame', name: 'Photo frames', detail: 'Set of 4, oak', price: 32 },
    { id: 'basket', name: 'Storage basket', detail: 'Woven seagrass', price: 27 },
    { id: 'headphones', name: 'Headphones', detail: 'Wireless, 30 hours', price: 119 },
    { id: 'timer', name: 'Kitchen timer', detail: 'Magnetic, 60 minutes', price: 13 },
];

export interface Notification {
    id: string;
    kind: 'liked' | 'shipped' | 'delivered' | 'review';
    text: string;
    time: string;
}

const NOTIFICATIONS: Notification[] = [
    { id: 'n1', kind: 'shipped', text: 'Your desk lamp is on its way.', time: '2 h' },
    { id: 'n2', kind: 'liked', text: 'The puzzle you liked is back in stock.', time: '5 h' },
    { id: 'n3', kind: 'review', text: 'How do you like your notebook?', time: '1 d' },
    { id: 'n4', kind: 'delivered', text: 'Your keyring was delivered.', time: '2 d' },
    { id: 'n5', kind: 'liked', text: 'The desk clock you liked is 20% off.', time: '3 d' },
];

export interface CartLine {
    id: string;
    quantity: number;
}

interface Store {
    cart: CartLine[];
    /** How many items, all lines together: the badge on the tab. */
    count: number;
    liked: ReadonlySet<string>;
    notifications: Notification[];
    unread: number;
    /** One more of a product: a new line, or one more on its line. */
    add(id: string): void;
    /** One fewer, down to one. */
    decrease(id: string): void;
    remove(id: string): void;
    clearCart(): void;
    toggleLike(id: string): void;
    readAll(): void;
    /** A notification comes in (here: on a refresh of the home screen). */
    receive(): void;
}

const INCOMING: Omit<Notification, 'id' | 'time'>[] = [
    { kind: 'liked', text: 'Someone liked the plant you shared.' },
    { kind: 'shipped', text: 'Your headphones are on their way.' },
    { kind: 'review', text: 'Tell us about your lamp.' },
];

const StoreContext = createContext<Store | null>(null);

export function StoreProvider(props: { children: ReactNode }) {
    const [cart, setCart] = useState<CartLine[]>([]);
    const [liked, setLiked] = useState<ReadonlySet<string>>(new Set());
    const [notifications, setNotifications] = useState(NOTIFICATIONS);
    const [unread, setUnread] = useState(3);

    const store = useMemo<Store>(
        () => ({
            cart,
            count: cart.reduce((sum, line) => sum + line.quantity, 0),
            liked,
            notifications,
            unread,
            add: (id) =>
                setCart((lines) =>
                    lines.some((line) => line.id === id)
                        ? lines.map((line) =>
                              line.id === id ? { ...line, quantity: line.quantity + 1 } : line,
                          )
                        : [...lines, { id, quantity: 1 }],
                ),
            decrease: (id) =>
                setCart((lines) =>
                    lines.map((line) =>
                        line.id === id && line.quantity > 1
                            ? { ...line, quantity: line.quantity - 1 }
                            : line,
                    ),
                ),
            remove: (id) => setCart((lines) => lines.filter((line) => line.id !== id)),
            clearCart: () => setCart([]),
            toggleLike: (id) =>
                setLiked((ids) => {
                    const next = new Set(ids);
                    if (!next.delete(id)) next.add(id);
                    return next;
                }),
            readAll: () => setUnread(0),
            receive: () => {
                setNotifications((all) => [
                    {
                        ...INCOMING[all.length % INCOMING.length],
                        id: `n${all.length + 1}`,
                        time: 'now',
                    },
                    ...all,
                ]);
                setUnread((count) => count + 1);
            },
        }),
        [cart, liked, notifications, unread],
    );

    return <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>;
}

export function useStore(): Store {
    const store = useContext(StoreContext);
    if (!store) throw new Error('useStore outside StoreProvider');
    return store;
}

export function productOf(id: string): Product {
    return PRODUCTS.find((product) => product.id === id)!;
}

export function price(value: number): string {
    return `$${value.toFixed(2)}`;
}
