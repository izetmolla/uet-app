import { Tabs } from "expo-router"
import {
    BookOpen,
    CalendarDays,
    Home,
    MessageCircle,
    User,
} from "lucide-react-native"

import {
    useTabBarColors,
    useTabBarStyle,
} from "@/components/navigation/use-tab-bar-style"

export default function TabsLayout() {
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
