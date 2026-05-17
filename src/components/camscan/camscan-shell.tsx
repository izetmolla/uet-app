import type { ReactNode } from "react"
import { View } from "react-native"

import { AppHeader } from "@/components/navigation/app-header"

type CamscanShellProps = {
    children: ReactNode
    showMenu?: boolean
}

export function CamscanShell({ children, showMenu = true }: CamscanShellProps) {
    return (
        <View style={{ flex: 1 }}>
            <AppHeader title="Camscan" showMenu={showMenu} />
            <View style={{ flex: 1 }}>{children}</View>
        </View>
    )
}
