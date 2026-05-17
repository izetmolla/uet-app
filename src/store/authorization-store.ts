import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { create, type StateCreator } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"
import type { Tokens, User } from "../types"

export interface AuthorizationState {
    hydrated: boolean
    setHydrated: (hydrated: boolean) => void
    user?: User
    tokens?: Tokens
    isSignedIn: boolean
    redirectUrl?: string
    sessions: string[]
    signIn: (isSignedIn: boolean) => void
    signOut: () => void
    setAccessToken: (token: string) => void
    signInUser: ({ user, tokens }: { user?: User; tokens?: Tokens }) => void
    setRedirectUrl: (url: string) => void
}

/**
 * Notifies the backend to invalidate the server-side session and clear
 * the cookie. We deliberately use a bare axios call rather than
 * ApiService here so that:
 *
 *   - The request interceptor doesn't try to refresh a token that we
 *     are about to throw away.
 *   - The response interceptor doesn't recursively call signOut() on
 *     a 401 (which can happen when the session has already expired by
 *     the time we get here).
 *
 * Failures are intentionally swallowed: the user has clearly indicated
 * they want to be signed out and we should never block that on a
 * flaky network or an already-revoked session.
 */
async function callSignOutEndpoint(): Promise<void> {
    try {
        await axios({
            method: "post",
            url: "/api/authorization/sign-out",
            withCredentials: true,
            timeout: 5000,
        })
    } catch {
        /* idempotent: already signed out / network down / cookie missing */
    }
}

const authorizationStore: StateCreator<AuthorizationState> = (set) => ({
    hydrated: false,
    setHydrated: (hydrated) => set({ hydrated }),
    user: undefined,
    tokens: undefined,
    isSignedIn: false,
    redirectUrl: "",
    sessions: [],
    setRedirectUrl: (url) => set({ redirectUrl: url }),
    signIn: (isSignedIn) => set({ isSignedIn }),
    signOut: () => {
        void callSignOutEndpoint()
        set({
            user: undefined,
            tokens: undefined,
            isSignedIn: false,
        })
    },
    setAccessToken: (access_token) =>
        set((state) => ({
            tokens: {
                access_token,
                refresh_token: state.tokens?.refresh_token ?? "",
            },
        })),
    signInUser: (props) =>
        set({ isSignedIn: true, user: props.user, tokens: props.tokens }),
})

const useAuthorizationStore = create<AuthorizationState>()(
    devtools(
        persist(authorizationStore, {
            name: "authorization-storage",
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHydrated(true)
            },
        }),
        {
            name: "authorization-storage",
            enabled: process.env.NODE_ENV === "development",
        }
    )
)

export default useAuthorizationStore
