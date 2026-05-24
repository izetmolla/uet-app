/**
 * Imperative toast bridge for non-React code (e.g. axios interceptors).
 *
 * `AppToastProvider` registers the handler on mount so interceptors can
 * surface auth errors without importing React hooks.
 */

export type NetworkToastHandler = (message: string) => void

let errorToastHandler: NetworkToastHandler | null = null

export function registerNetworkErrorToast(handler: NetworkToastHandler | null) {
    errorToastHandler = handler
}

export function showNetworkErrorToast(message: string) {
    errorToastHandler?.(message)
}
