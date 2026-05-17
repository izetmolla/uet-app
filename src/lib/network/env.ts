/**
 * Runtime environment helpers. Kept apart from the axios client so
 * tests can import them without booting the full network stack and
 * so they can be tweaked in one place when the embedding strategy
 * changes (e.g. when an SSR shell starts injecting `__GLOBAL_DATA__`).
 */

/**
 * Path prefixes that should never have the auto-derived `service`
 * segment inserted by `withService`. Currently empty; exported so
 * callers can mutate it during bootstrap without a bigger API.
 */
export const exceptedPaths: string[] = []


/**
 * Builds the absolute base URL the API client should use. The "app"
 * service lives at the origin root; everything else is sandboxed
 * under `/<service>`.
 */
export function baseApiURL(): string {
    return `https://uet.izetmolla.com/api`
}

/**
 * `process.env.NODE_ENV` access wrapped so it can't blow up in a CJS
 * test runner that doesn't expose `process.env`. The function form
 * also lets tests stub it out via `vi.spyOn` if they need to.
 */
export function isDev(): boolean {
    return process.env.NODE_ENV === "development"
}
