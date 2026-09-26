/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHATBOT_API_URL?: string;
  readonly VITE_ANALYTICS_API_URL?: string;
  readonly VITE_ANALYTICS_DISABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "@fontsource-variable/manrope";
