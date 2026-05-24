/**
 * Runtime environment helpers for React Native / Expo.
 *
 * Kept apart from the axios client so tests can import them without
 * booting the full network stack.
 */

/**
 * Path prefixes that should never have the auto-derived `service`
 * segment inserted by `withService`. Currently empty; exported so
 * callers can mutate it during bootstrap without a bigger API.
 */
export const exceptedPaths: string[] = []

const DEFAULT_API_URL = "https://uet.izetmolla.com/api"

/**
 * Builds the absolute base URL the API client should use.
 * Override via `EXPO_PUBLIC_API_URL` in app config or `.env`.
 */
export function baseApiURL(): string {
    const configured = process.env.EXPO_PUBLIC_API_URL?.trim()
    return configured && configured.length > 0 ? configured : DEFAULT_API_URL
}

/** Expo / React Native dev flag. */
export function isDev(): boolean {
    return __DEV__
}
