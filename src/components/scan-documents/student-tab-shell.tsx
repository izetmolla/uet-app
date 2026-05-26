import { type Href, useLocalSearchParams, useRouter } from "expo-router"
import type { ReactNode } from "react"
import { useCallback } from "react"

import { AppHeader } from "@/components/navigation/app-header"
import {
    ScreenContentSafeArea,
    ScreenSafeArea,
} from "@/components/navigation/screen-safe-area"
import { Box } from "@/components/ui/box"

export function getRouteParam(
    value: string | string[] | undefined
): string | undefined {
    if (typeof value === "string") return value
    if (Array.isArray(value)) return value[0]
    return undefined
}

export function StudentTabShell({
    title,
    children,
}: {
    title: string
    children: ReactNode
}) {
    const router = useRouter()
    const params = useLocalSearchParams<{
        folder_id: string
        student_id: string
        folder_name?: string | string[]
        student_name?: string | string[]
    }>()

    const openSettings = useCallback(() => {
        router.push({
            pathname: "/scan-documents/students/settings",
            params: {
                student_name: getRouteParam(params.student_name),
            },
        } as Href)
    }, [params, router])

    return (
        <ScreenSafeArea>
            <AppHeader
                title={title}
                showBack
                showMenu={false}
                showSearch={false}
                showSettings
                showNotifications={false}
                onSettingsPress={openSettings}
            />
            <ScreenContentSafeArea>
                <Box className="flex-1 bg-background-50">{children}</Box>
            </ScreenContentSafeArea>
        </ScreenSafeArea>
    )
}
