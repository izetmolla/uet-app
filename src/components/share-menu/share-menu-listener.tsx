import { useRouter, type Href } from "expo-router"
import { useEffect } from "react"
import { NativeModules, Platform } from "react-native"
import ShareMenu, { type ShareData } from "react-native-share-menu"

import { normalizeSharePayload } from "@/lib/share-menu/normalize-share"
import useShareMenuStore from "@/store/share-menu-store"
import type { SharedPayload } from "@/types/share-menu"

function handleIncomingShare(
    raw: ShareData | null | undefined,
    setPayload: (payload: SharedPayload) => void,
    navigate: () => void,
) {
    const payload = normalizeSharePayload(raw ?? undefined)

    if (!payload) {
        return
    }

    setPayload(payload)
    navigate()
}

export function ShareMenuListener() {
    const router = useRouter()
    const setPayload = useShareMenuStore((state) => state.setPayload)

    useEffect(() => {
        if (Platform.OS === "web" || !NativeModules.ShareMenu) {
            return
        }

        const navigateToShareTo = () => {
            router.push("/share-to" as Href)
        }

        ShareMenu.getInitialShare((item) => {
            handleIncomingShare(item, setPayload, navigateToShareTo)
        })

        const listener = ShareMenu.addNewShareListener((item) => {
            handleIncomingShare(item, setPayload, navigateToShareTo)
        })

        return () => {
            listener.remove()
        }
    }, [router, setPayload])

    return null
}
