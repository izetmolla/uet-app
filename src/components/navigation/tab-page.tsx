import type { ReactNode } from "react"

import { AppHeader } from "@/components/navigation/app-header"
import {
    ScreenContentSafeArea,
    ScreenSafeArea,
} from "@/components/navigation/screen-safe-area"

type TabPageProps = {
    title: string
    children: ReactNode
}

export function TabPage({ title, children }: TabPageProps) {
    return (
        <ScreenSafeArea>
            <AppHeader title={title} />
            <ScreenContentSafeArea>{children}</ScreenContentSafeArea>
        </ScreenSafeArea>
    )
}
