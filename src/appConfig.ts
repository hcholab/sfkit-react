import { UserManagerSettings } from "oidc-client-ts";

export type AppConfig = {
    api: ApiConfig
    auth: UserManagerSettings
}

export type ApiConfig = {
    rawls: string
    sam: string
    sfkit: string
}

export const getAppConfig = async (): Promise<AppConfig> => {
    const res = await fetch('./appConfig.json');
    const { api, auth }: AppConfig = await res.json();
    return {
        api,
        auth: {
            popup_redirect_uri: window.origin, // consider implementing `${window.origin}/redirect-from-oauth`, as in Terra
            silent_redirect_uri: window.origin, // consider implementing `${window.origin}/redirect-from-oauth-silent`, as in Terra
            prompt: 'consent login',
            scope: 'openid email profile',
            automaticSilentRenew: true,
            // In Terra, Leo's setCookie interval is currently 5 min; set refresh auth then 5 min 30 seconds
            // to guarantee that setCookie's token won't expire between 2 setCookie api calls
            accessTokenExpiringNotificationTimeInSeconds: 330,
            includeIdTokenInSilentRenew: true,
            extraQueryParams: { access_type: 'offline' },
            ...auth,
        }
    };
};
