import { Tabs } from "expo-router"
import { Camera, FolderOpen } from "lucide-react-native"

import { useTabBarStyle } from "@/components/navigation/use-tab-bar-style"

const tabActive = "#5358ee"
const tabInactive = "#595d69"

export default function CamscanTabsLayout() {
    const tabBarStyle = useTabBarStyle()

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: tabActive,
                tabBarInactiveTintColor: tabInactive,
                tabBarStyle,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "500",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Scan",
                    tabBarIcon: ({ color, size }) => (
                        <Camera color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="library"
                options={{
                    title: "Manage",
                    tabBarIcon: ({ color, size }) => (
                        <FolderOpen color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    )
}
