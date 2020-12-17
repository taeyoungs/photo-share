import { LocalStorageWrapper, persistCache } from 'apollo3-cache-persist';
import { useCallback } from 'react';

export const usePersistCache = () => {
    const callback = useCallback(async (cache) => {
        try {
            await persistCache({
                cache,
                storage: new LocalStorageWrapper(window.localStorage),
            });
        } catch (error) {
            console.log('Error restoring Apollo cache', error);
        }
    }, []);

    return { callback };
};
