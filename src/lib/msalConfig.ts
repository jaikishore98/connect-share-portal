import { Configuration, PublicClientApplication } from '@azure/msal-browser';

// MSAL configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: 'cb6bb5ff-6792-4428-820c-a6ee76abf4b5', // Replace with your Azure AD Client ID
    authority: 'https://login.microsoftonline.com/a1152b72-d27b-421d-a487-0ca747aa4688', // Replace with your tenant ID
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