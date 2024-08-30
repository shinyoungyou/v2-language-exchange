/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_CHAT_URL: string
    readonly VITE_GOOGLE_CLIENT_ID: string
    readonly VITE_RECAPTCHA_SITE_KEY: string   
    readonly VITE_GOOGLE_MAPS_API_KEY: string
}

interface ImportMeta {
    readonly env: string
}