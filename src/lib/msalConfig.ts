import { Configuration, PublicClientApplication } from '@azure/msal-browser';

// MSAL configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: 'YOUR_CLIENT_ID', // Replace with your Azure AD Client ID
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID', // Replace with your tenant ID
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage', // Can be 'localStorage' or 'sessionStorage'
    storeAuthStateInCookie: false, // Set to true for IE11 or Edge
  },
};

// Create the MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

// Login request configuration
export const loginRequest = {
  scopes: ['openid', 'profile', 'email', 'User.Read'],
};