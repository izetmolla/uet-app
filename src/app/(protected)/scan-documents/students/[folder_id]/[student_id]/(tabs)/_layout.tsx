import { type Href, router, Tabs, useLocalSearchParams } from "expo-router"
import { ClipboardCheck, Scan } from "lucide-react-native"
import { useCallback } from "react"

import { ScreenSafeArea } from "@/components/navigation/screen-safe-area"
import {
    useTabBarColors,
    useTabBarStyle,
} from "@/components/navigation/use-tab-bar-style"
import { ScanDocumentsHeader } from "@/components/scan-documents/header"
import { getRouteParam } from "@/components/scan-documents/student-tab-shell"
import { useDisableDrawerSwipe } from "@/hooks/use-disable-drawer-swipe"
import { useScanDocumentsStore } from "@/store/scan-documents"

export default function StudentTabsLayout() {
    useDisableDrawerSwipe()

    const tabBarStyle = useTabBarStyle()
    const { tabBarActiveTintColor, tabBarInactiveTintColor } = useTabBarColors()
    const { folder_id, student_id, student_name } = useLocalSearchParams<{
        folder_id: string
        student_id: string
        student_name?: string | string[]
    }>()

    const headerTitle = getRouteParam(student_name) ?? "Student"
    const photosViewMode = useScanDocumentsStore((s) => s.photosViewMode)
    const togglePhotosViewMode = useScanDocumentsStore(
        (s) => s.togglePhotosViewMode
    )

    const openSettings = useCallback(() => {
        router.push({
            pathname: "/scan-documents/students/settings",
            params: { student_name: getRouteParam(student_name) },
        } as Href)
    }, [student_name])

    const renderDocumentsHeader = useCallback(
        () => (
            <ScanDocumentsHeader
                title={headerTitle}
                showBack
                showMenu={false}
                showSearch={false}
                showSettings
                showNotifications={false}
                onSettingsPress={openSettings}
                photosViewMode={photosViewMode}
                onTogglePhotosViewMode={togglePhotosViewMode}
            />
        ),
        [
            headerTitle,
            openSettings,
            photosViewMode,
            togglePhotosViewMode,
        ]
    )

    const renderHeader = useCallback(
        () => (
            <ScanDocumentsHeader
                title={headerTitle}
                showBack
                showMenu={false}
                showSearch={false}
                showSettings
                showNotifications={false}
                onSettingsPress={openSettings}
            />
        ),
        [headerTitle, openSettings]
    )

    return (
        <ScreenSafeArea>
            <Tabs
                screenOptions={{
                    headerShown: true,
                    header: renderHeader,
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
                        href: null,
                        header: renderDocumentsHeader,
                    }}
                />

                <Tabs.Screen
                    name="scan-now"
                    options={{
                        title: "Add",
                        tabBarIcon: ({ color, size }) => (
                            <Scan color={color} size={size} />
                        ),
                    }}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault()
                            router.push({
                                pathname: "/scan-documents/students/camera",
                                params: {
                                    folder_id: getRouteParam(folder_id),
                                    student_id: getRouteParam(student_id),
                                    student_name: getRouteParam(student_name),
                                },
                            } as Href)
                        },
                    }}
                />
                <Tabs.Screen
                    name="check"
                    options={{
                        title: "Check",
                        tabBarIcon: ({ color, size }) => (
                            <ClipboardCheck color={color} size={size} />
                        ),
                    }}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault()
                            router.push({
                                pathname: "/scan-documents/students/[folder_id]/[student_id]/document-check",
                                params: {
                                    folder_id: getRouteParam(folder_id),
                                    student_id: getRouteParam(student_id),
                                    student_name: getRouteParam(student_name),
                                },
                            } as Href)
                        },
                    }}
                />
            </Tabs>
        </ScreenSafeArea>
    )
}
