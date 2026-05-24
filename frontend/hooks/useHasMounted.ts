// hooks/useHasMounted.ts
import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

export function useHasMounted() {
    return useSyncExternalStore(
        subscribe,
        () => true,   // client: mounted
        () => false   // server: not mounted
    );
}