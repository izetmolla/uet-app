/**
 * Wires the request and response interceptors onto `BaseService`.
 *
 * Importing this module is the SIDE EFFECT that activates the auth
 * pipeline. The barrel re-export in `./index.ts` triggers it,
 * which is why every consumer of the package gets the configured
 * client transparently.
 */

import type { AxiosError } from "axios"

import useAuthorizationStore from "../../store/authorization-store"

import { BaseService } from "./client"
import {
    FATAL_AUTH_CODES,
    PERMISSION_CODES,
    REFRESHABLE_AUTH_CODES,
} from "./constants"
import { isDev } from "./env"
import { isAccessTokenStale } from "./jwt"
import { applyAuthHeader, refreshAccessToken, type RetryableConfig } from "./refresh"
import { showNetworkErrorToast } from "./toast-bridge"

/**
 * Reads the optional `code` field from a JSON error envelope. The
 * backend uses this to disambiguate auth failures (`TOKEN_EXPIRED`,
 * `INSUFFICIENT_PERMISSIONS`, etc.) from generic 4xx noise.
 */
function getResponseCode(data: unknown): string | undefined {
    if (data && typeof data === "object") {
        const c = (data as Record<string, unknown>).code
        if (typeof c === "string") return c
    }
    return undefined
}

/**
 * Performs a hard sign-out on the client: clears the local store and
 * surfaces a single toast. The backend session is invalidated by the
 * dedicated sign-out endpoint, which is fired separately from the
 * store and tolerates a missing session.
 */
function forceSignOut(message?: string): void {
    const { signOut } = useAuthorizationStore.getState()
    signOut()
    if (message) {
        showNetworkErrorToast(message)
    }
}

/** User is signed in but lacks rights; show the app unauthorized page, keep session. */
function showUnauthorizedPage(): void {
    useAuthorizationStore.getState().setAccessDenied(true)
}

BaseService.interceptors.request.use(
    async (config) => {
        const cfg = config as RetryableConfig

        if (cfg._isRefresh) {
            return config
        }

        const { tokens } = useAuthorizationStore.getState()
        const accessToken = tokens?.access_token ?? ""
        const refreshToken = tokens?.refresh_token ?? ""

        if (!accessToken && !refreshToken) {
            config.headers["cra"] = "t"
            return config
        }
        config.headers["cra"] = "f"

        if (accessToken && !isAccessTokenStale(accessToken)) {
            applyAuthHeader(config, accessToken)
            return config
        }

        if (refreshToken) {
            const newAccess = await refreshAccessToken(config, refreshToken)
            if (newAccess) {
                applyAuthHeader(config, newAccess)
                return config
            }
        }

        if (accessToken) {
            applyAuthHeader(config, accessToken)
        }
        return config
    },
    (error) => Promise.reject(error),
)

BaseService.interceptors.response.use(
    (response) => {
        if (response && response.status === 200 && response.data?.reauthorize) {
            const { signInUser } = useAuthorizationStore.getState()
            signInUser({
                user: response.data.user,
                tokens: response?.data?.tokens,
            })
            const cfg = response.config as RetryableConfig
            if (!cfg._authRetried) {
                cfg._authRetried = true
                return BaseService(cfg)
            }
        }
        return response
    },
    async (error: AxiosError) => {
        const response = error.response
        const cfg = error.config as RetryableConfig | undefined

        if (cfg?._isRefresh) {
            return Promise.reject(error)
        }

        if (!response) {
            return Promise.reject(error)
        }

        const status = response.status
        const code = getResponseCode(response.data)
        const { isSignedIn } = useAuthorizationStore.getState()

        const isAccessDenied =
            (code !== undefined && PERMISSION_CODES.has(code)) ||
            status === 403 ||
            (isSignedIn && code === "UNAUTHORIZED")

        if (isAccessDenied) {
            showUnauthorizedPage()
            return Promise.reject(error)
        }

        if (status === 401) {
            const isRefreshable = !code || REFRESHABLE_AUTH_CODES.has(code)
            const isFatal = code !== undefined && FATAL_AUTH_CODES.has(code)

            if (cfg && isRefreshable && !isFatal && !cfg._authRetried) {
                const { tokens } = useAuthorizationStore.getState()
                const refreshToken = tokens?.refresh_token ?? ""
                if (refreshToken) {
                    cfg._authRetried = true
                    const newAccess = await refreshAccessToken(cfg, refreshToken)
                    if (newAccess) {
                        applyAuthHeader(cfg, newAccess)
                        return BaseService(cfg)
                    }
                }
            }

            forceSignOut(
                code === "INVALID_CREDENTIALS"
                    ? "Invalid credentials"
                    : "Session expired. Please sign in again.",
            )
            return Promise.reject(error)
        }

        if (status >= 500 && status < 600 && isDev()) {
            console.warn(`Server error ${status}:`, response.data)
        }

        return Promise.reject(error)
    },
)
