import { Tabs } from "expo-router"
import {
    BookOpen,
    CalendarDays,
    Home,
    MessageCircle,
    User,
} from "lucide-react-native"

import { useTabBarStyle } from "@/components/navigation/use-tab-bar-style"

const tabActive = "#5358ee"
const tabInactive = "#595d69"

export default function TabsLayout() {
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
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Home color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="courses"
                options={{
                    title: "Courses",
                    tabBarIcon: ({ color, size }) => (
                        <BookOpen color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="schedule"
                options={{
                    title: "Schedule",
                    tabBarIcon: ({ color, size }) => (
                        <CalendarDays color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="messages"
                options={{
                    title: "Messages",
                    tabBarIcon: ({ color, size }) => (
                        <MessageCircle color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <User color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    )
}
