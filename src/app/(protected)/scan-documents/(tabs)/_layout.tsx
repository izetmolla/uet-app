import { Tabs } from "expo-router"
import { Camera, FolderOpen } from "lucide-react-native"

import {
    useTabBarColors,
    useTabBarStyle,
} from "@/components/navigation/use-tab-bar-style"

export default function ScanDocumentsTabsLayout() {
    const tabBarStyle = useTabBarStyle()
    const { tabBarActiveTintColor, tabBarInactiveTintColor } = useTabBarColors()

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor,
                tabBarInactiveTintColor,
                tabBarStyle,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "500",
                },
            }}
        >

            <Tabs.Screen
                name="library"
                options={{
                    title: "Manage",
                    tabBarIcon: ({ color, size }) => (
                        <FolderOpen color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: "Scan",
                    tabBarIcon: ({ color, size }) => (
                        <Camera color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    )
}
