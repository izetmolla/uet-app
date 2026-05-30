import { create } from "zustand"

import type { SharedPayload } from "@/types/share-menu"

type ShareMenuState = {
    payload: SharedPayload | null
    setPayload: (payload: SharedPayload) => void
    clearPayload: () => void
}

const useShareMenuStore = create<ShareMenuState>((set) => ({
    payload: null,
    setPayload: (payload) => set({ payload }),
    clearPayload: () => set({ payload: null }),
}))

export default useShareMenuStore
