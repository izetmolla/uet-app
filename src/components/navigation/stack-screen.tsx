import type { ReactNode } from "react"

import { AppHeader } from "@/components/navigation/app-header"
import { Box } from "@/components/ui/box"

type StackScreenProps = {
    title: string
    children: ReactNode
    showSearch?: boolean
    showNotifications?: boolean
}

export function StackScreen({
    title,
    children,
    showSearch = false,
    showNotifications = false,
}: StackScreenProps) {
    return (
        <Box className="flex-1 bg-background-50">
            <AppHeader
                title={title}
                showBack
                showMenu={false}
                showSearch={showSearch}
                showNotifications={showNotifications}
            />
            {children}
        </Box>
    )
}
