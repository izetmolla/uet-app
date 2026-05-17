import type { ReactNode } from "react"

import { AppHeader } from "@/components/navigation/app-header"
import {
    ScreenContentSafeArea,
    ScreenSafeArea,
} from "@/components/navigation/screen-safe-area"

type CamscanShellProps = {
    children: ReactNode
    showMenu?: boolean
}

export function CamscanShell({ children, showMenu = true }: CamscanShellProps) {
    return (
        <ScreenSafeArea>
            <AppHeader title="Camscan" showMenu={showMenu} />
            <ScreenContentSafeArea>{children}</ScreenContentSafeArea>
        </ScreenSafeArea>
    )
}
