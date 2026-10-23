import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';

/**
 * A number that grows each time the screen shows again. As the `key` of a `<LordIcon>` with an
 * `intro`, it mounts the icon anew on each visit, so the intro plays from its first frame.
 */
export function useVisit(): number {
    const [visit, setVisit] = useState(0);
    const first = useRef(true);
    useFocusEffect(
        useCallback(() => {
            if (first.current) first.current = false;
            else setVisit((count) => count + 1);
        }, []),
    );
    return visit;
}
