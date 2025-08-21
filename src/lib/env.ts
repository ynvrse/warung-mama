export const env = {
    instantDbAppId: import.meta.env.VITE_INSTANTDB_APP_ID,
};

if (!env.instantDbAppId) {
    throw new Error('Missing required environment variables');
}
