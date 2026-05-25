import { Redirect } from "expo-router"
import { Drawer } from "expo-router/drawer"
import { View } from "react-native"

import { AppDrawerContent } from "@/components/navigation/app-drawer-content"
import useAuthorizationStore from "@/store/authorization-store"

const hiddenDrawerItem = { drawerItemStyle: { display: "none" as const } }

export default function ProtectedLayout() {
    const user = useAuthorizationStore((s) => s.user)
    const hydrated = useAuthorizationStore((s) => s.hydrated)

    if (!hydrated) {
        return <View style={{ flex: 1 }} />
    }

    if (!user) {
        return <Redirect href="/login" />
    }

    return (
        <Drawer
            drawerContent={(props) => <AppDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerType: "front",
                drawerPosition: "left",
                overlayColor: "rgba(14, 17, 27, 0.4)",
                swipeEdgeWidth: 48,
            }}
        >
            <Drawer.Screen name="(tabs)" options={{ title: "Home" }} />
            <Drawer.Screen
                name="announcements"
                options={hiddenDrawerItem}
            />
            <Drawer.Screen
                name="course-details"
                options={hiddenDrawerItem}
            />
            <Drawer.Screen
                name="campus-services"
                options={hiddenDrawerItem}
            />
            <Drawer.Screen name="settings" options={hiddenDrawerItem} />
            {/* <Drawer.Screen name="camscan" options={{ title: "Camscan" }} /> */}
            <Drawer.Screen name="scan-documents" options={{ title: "Scan Documents" }} />
        </Drawer>
    )
}
