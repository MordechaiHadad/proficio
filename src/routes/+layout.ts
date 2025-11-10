// Tauri doesn't have a Node.js server to do proper SSR
// so we use adapter-static with a fallback to index.html to put the site in SPA mode
// See: https://svelte.dev/docs/kit/single-page-apps
// See: https://v2.tauri.app/start/frontend/sveltekit/ for more info
export const ssr = false;

import type { LayoutLoad } from './$types';
import { getAppSettings, getAllActiveHabitsNotFailed } from '$lib/db';

export const load: LayoutLoad = async () => {
    const Database = (await import('@tauri-apps/plugin-sql')).default;
    const db = await Database.load('sqlite:proficio.db');

    const settings = await getAppSettings(db);
    const habits = await getAllActiveHabitsNotFailed(db);

    return {
        settings,
        habits,
    };
};