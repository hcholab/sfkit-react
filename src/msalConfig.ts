import {Configuration, PublicClientApplication} from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_REACT_APP_CLIENT_ID as string,
    authority: `https://sfkitdevb2c.b2clogin.com/${import.meta.env.VITE_REACT_APP_TENANT_NAME}.onmicrosoft.com/${import.meta.env.VITE_REACT_APP_SIGNUPSIGNIN_USER_FLOW}`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    knownAuthorities: [`sfkitdevb2c.b2clogin.com`]
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false
  }
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const loginRequest = {
  scopes: ["openid", "profile"]
};
