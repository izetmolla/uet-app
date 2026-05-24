/**
 * Small URL/route helpers used by feature-specific API modules.
 *
 * React Native note: `withService` and `withInitialData` are web-only
 * (they depend on `window` and SSR-injected data). Only portable
 * helpers live here.
 */

/** Generic paginated payload shape used by list endpoints. */
export interface WithPagination<T> {
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        total_pages: number
    }
}

/**
 * Prefixes a route with `api`. Accepts both leading-slash and
 * leading-segment input so call sites can stay readable.
 *
 * When `baseApiURL()` already ends with `/api`, prefer paths like
 * `/authorization/sign-in` without this helper.
 */
export function withAPI(path: string): string {
    if (path.startsWith("/")) {
        return `api${path}`
    }
    return `api/${path}`
}
