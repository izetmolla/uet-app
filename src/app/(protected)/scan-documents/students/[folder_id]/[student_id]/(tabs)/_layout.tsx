import { Tabs } from "expo-router"
import { Camera, ClipboardCheck, FileText } from "lucide-react-native"

import {
    useTabBarColors,
    useTabBarStyle,
} from "@/components/navigation/use-tab-bar-style"

export default function StudentTabsLayout() {
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
                name="index"
                options={{
                    title: "Doccuments",
                    tabBarIcon: ({ color, size }) => (
                        <FileText color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="scan-now"
                options={{
                    title: "Scan Now",
                    tabBarIcon: ({ color, size }) => (
                        <Camera color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="document-check"
                options={{
                    title: "Check",
                    tabBarIcon: ({ color, size }) => (
                        <ClipboardCheck color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    )
}
