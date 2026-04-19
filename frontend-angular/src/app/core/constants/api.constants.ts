type RuntimeConfig = {
  apiBaseUrl?: string;
  useMockPublicData?: boolean;
};

const runtimeConfig = (globalThis as typeof globalThis & { __HOUSE_BURGUER_CONFIG__?: RuntimeConfig })
  .__HOUSE_BURGUER_CONFIG__;

export const API_BASE_URL = runtimeConfig?.apiBaseUrl ?? 'http://localhost:8080/api/v1';
export const USE_MOCK_PUBLIC_DATA = runtimeConfig?.useMockPublicData ?? true;
export const AUTH_STORAGE_KEY = 'house-burguer-angular-auth-v1';
export const CART_STORAGE_KEY = 'house-burguer-angular-cart-v1';
