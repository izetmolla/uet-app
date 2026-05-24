import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { create, type StateCreator } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"

import {
    REQUEST_HEADER_AUTH_KEY,
    TOKEN_TYPE,
} from "../lib/network/constants"
import { baseApiURL } from "../lib/network/env"
import type { Tokens, User } from "../types"

export interface AuthorizationState {
    hydrated: boolean
    setHydrated: (hydrated: boolean) => void
    user?: User
    tokens?: Tokens
    isSignedIn: boolean
    accessDenied: boolean
    redirectUrl?: string
    sessions: string[]
    signIn: (isSignedIn: boolean) => void
    signOut: () => void
    setAccessToken: (token: string) => void
    signInUser: ({ user, tokens }: { user?: User; tokens?: Tokens }) => void
    setRedirectUrl: (url: string) => void
    setAccessDenied: (accessDenied: boolean) => void
    clearAccessDenied: () => void
}

/**
 * Notifies the backend to invalidate the server-side session. We use a
 * bare axios call rather than ApiService so that:
 *
 *   - The request interceptor doesn't try to refresh a token we are
 *     about to throw away.
 *   - The response interceptor doesn't recursively call signOut() on
 *     a 401 (which can happen when the session has already expired).
 *
 * Failures are intentionally swallowed: the user wants to sign out and
 * we should never block that on a flaky network.
 */
async function callSignOutEndpoint(): Promise<void> {
    const { tokens } = useAuthorizationStore.getState()
    const accessToken = tokens?.access_token

    try {
        await axios({
            method: "post",
            url: `${baseApiURL()}/authorization/sign-out`,
            timeout: 5000,
            headers: accessToken
                ? {
                      [REQUEST_HEADER_AUTH_KEY]: `${TOKEN_TYPE}${accessToken}`,
                  }
                : undefined,
        })
    } catch {
        /* idempotent: already signed out / network down */
    }
}

const authorizationStore: StateCreator<AuthorizationState> = (set) => ({
    hydrated: false,
    setHydrated: (hydrated) => set({ hydrated }),
    user: undefined,
    tokens: undefined,
    isSignedIn: false,
    accessDenied: false,
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
            accessDenied: false,
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
        set({
            isSignedIn: true,
            accessDenied: false,
            user: props.user,
            tokens: props.tokens,
        }),
    setAccessDenied: (accessDenied) => set({ accessDenied }),
    clearAccessDenied: () => set({ accessDenied: false }),
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
