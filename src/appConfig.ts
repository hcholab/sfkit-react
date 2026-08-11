import { FirebaseConfig } from "./hooks/firebase";

export type AppConfig = {
    apiBaseUrl: string;
    firebase: FirebaseConfig;
};

export const getAppConfig = async (): Promise<AppConfig> => {
    const res = await fetch('/appConfig.json');
    return res.json();
};
