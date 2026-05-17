import type { ReactNode } from "react"
import { View } from "react-native"

import { AppHeader } from "@/components/navigation/app-header"

type TabPageProps = {
    title: string
    children: ReactNode
}

export function TabPage({ title, children }: TabPageProps) {
    return (
        <View style={{ flex: 1 }}>
            <AppHeader title={title} />
            <View style={{ flex: 1 }}>{children}</View>
        </View>
    )
}
