import type { ReactNode } from "react"

import { AppHeader } from "@/components/navigation/app-header"
import {
    ScreenContentSafeArea,
    ScreenSafeArea,
} from "@/components/navigation/screen-safe-area"
import { Box } from "@/components/ui/box"

type StackScreenProps = {
    title: string
    children: ReactNode
    showSearch?: boolean
    showSettings?: boolean
    showNotifications?: boolean
}

export function StackScreen({
    title,
    children,
    showSearch = false,
    showSettings = false,
    showNotifications = false,
}: StackScreenProps) {
    return (
        <ScreenSafeArea>
            <AppHeader
                title={title}
                showBack
                showMenu={false}
                showSearch={showSearch}
                showSettings={showSettings}
                showNotifications={showNotifications}
            />
            <ScreenContentSafeArea>
                <Box className="flex-1 bg-background-50">{children}</Box>
            </ScreenContentSafeArea>
        </ScreenSafeArea>
    )
}
