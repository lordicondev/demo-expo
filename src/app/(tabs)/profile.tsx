import { LordIcon } from '@lordicon/react-native';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import avatarCircle from '@/assets/icons/avatar-circle.json';
import bell from '@/assets/icons/bell.json';
import chevronDown from '@/assets/icons/chevron-down.json';
import lock from '@/assets/icons/lock.json';
import upload from '@/assets/icons/upload.json';
import { useVisit } from '@/entrance';
import { tap } from '@/haptics';
import { useTheme } from '@/theme';

const QUESTIONS = [
    { q: 'When will my order arrive?', a: 'Most orders arrive in two to four working days.' },
    { q: 'Can I return something?', a: 'Yes, within 30 days, in the state it came in.' },
];

export default function Profile() {
    const theme = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [backup, setBackup] = useState(false);
    const [publicProfile, setPublicProfile] = useState(false);
    // Each time the tab shows, the avatar enters again: a new key mounts it anew.
    const visit = useVisit();

    return (
        <ScrollView
            style={{ backgroundColor: theme.background }}
            contentContainerStyle={styles.page}
        >
            <View style={styles.person}>
                <LordIcon key={visit} icon={avatarCircle} intro="in-reveal" size={72} />
                <Text style={[styles.name, { color: theme.text }]}>Alex Kim</Text>
                <Text style={{ color: theme.textMuted }}>alex@example.com</Text>
            </View>

            <Section title="Settings">
                {/* Each icon follows its switch: a value of the app. */}
                <Setting
                    icon={<LordIcon icon={bell} value={notifications} size={28} />}
                    title="Notifications"
                    detail={notifications ? 'On' : 'Off'}
                    value={notifications}
                    onChange={setNotifications}
                />
                <Setting
                    icon={<LordIcon icon={upload} state="loop-cycle" value={backup} size={28} />}
                    title="Back up photos"
                    detail={backup ? 'Backing up…' : 'Off'}
                    value={backup}
                    onChange={setBackup}
                />
                <Setting
                    icon={
                        <LordIcon icon={lock} state="morph-open" value={publicProfile} size={28} />
                    }
                    title="Public profile"
                    detail={publicProfile ? 'Anyone can see it' : 'Only you'}
                    value={publicProfile}
                    onChange={setPublicProfile}
                />
            </Section>

            <Section title="Help">
                {QUESTIONS.map((item) => (
                    <Question key={item.q} question={item.q} answer={item.a} />
                ))}
            </Section>
        </ScrollView>
    );
}

function Section(props: { title: string; children: ReactNode }) {
    const theme = useTheme();
    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{props.title}</Text>
            <View style={[styles.box, { backgroundColor: theme.surface }]}>{props.children}</View>
        </View>
    );
}

function Setting(props: {
    icon: ReactNode;
    title: string;
    detail: string;
    value: boolean;
    onChange: (value: boolean) => void;
}) {
    const theme = useTheme();
    return (
        <View style={styles.row}>
            {props.icon}
            <View style={styles.text}>
                <Text style={[styles.title, { color: theme.text }]}>{props.title}</Text>
                <Text style={{ color: theme.textMuted }}>{props.detail}</Text>
            </View>
            <Switch
                value={props.value}
                onValueChange={(value) => {
                    tap();
                    props.onChange(value);
                }}
                trackColor={{ true: theme.brand, false: theme.border }}
            />
        </View>
    );
}

function Question(props: { question: string; answer: string }) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: open }}
            onPress={() => {
                tap();
                setOpen(!open);
            }}
            style={styles.question}
        >
            <View style={styles.row}>
                <Text style={[styles.title, styles.text, { color: theme.text }]}>
                    {props.question}
                </Text>
                {/* Open or not: the chevron turns there and back. */}
                <LordIcon icon={chevronDown} state="morph-direction" value={open} size={24} />
            </View>
            {open && <Text style={{ color: theme.textSoft }}>{props.answer}</Text>}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    page: { padding: 16, gap: 24 },
    person: { alignItems: 'center', gap: 4, paddingVertical: 8 },
    name: { fontSize: 20, fontWeight: '700', marginTop: 8 },
    section: { gap: 8 },
    sectionTitle: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase' },
    box: { borderRadius: 16, paddingHorizontal: 16 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
    text: { flex: 1, gap: 2 },
    title: { fontSize: 16, fontWeight: '500' },
    question: { paddingBottom: 4 },
});
