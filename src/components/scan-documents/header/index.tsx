import { DrawerActions } from "@react-navigation/native"
import { type Href, useNavigation, useRouter } from "expo-router"
import {
    ArrowLeft,
    Bell,
    FileDown,
    LayoutGrid,
    List,
    Menu,
    Search,
    Settings,
} from "lucide-react-native"

import { Box } from "@/components/ui/box"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import {
    HEADER_ICON_BUTTON_SIZE,
    HEADER_ICON_SIZE,
    HEADER_ICON_SIZE_LARGE,
    HeaderIconButton,
} from "@/components/scan-documents/header/header-icon-button"
import { useThemeColors } from "@/hooks/use-theme-colors"
import type { PhotosViewMode } from "@/types/scan-documents"

type ScanDocumentsHeaderProps = {
    title: string
    showBack?: boolean
    showMenu?: boolean
    showSearch?: boolean
    showSettings?: boolean
    showNotifications?: boolean
    onSettingsPress?: () => void
    onExportPdfPress?: () => void
    exportPdfDisabled?: boolean
    photosViewMode?: PhotosViewMode
    onTogglePhotosViewMode?: () => void
}

export function ScanDocumentsHeader({
    title,
    showBack = false,
    showMenu = true,
    showSearch = true,
    showSettings = true,
    showNotifications = true,
    onSettingsPress,
    onExportPdfPress,
    exportPdfDisabled = false,
    photosViewMode,
    onTogglePhotosViewMode,
}: ScanDocumentsHeaderProps) {
    const router = useRouter()
    const navigation = useNavigation()
    const colors = useThemeColors()

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer())
    }

    const rightActionCount =
        (onTogglePhotosViewMode ? 1 : 0) +
        (showSearch ? 1 : 0) +
        (onExportPdfPress ? 1 : 0) +
        (showSettings ? 1 : 0) +
        (showNotifications ? 1 : 0)
    const rightMinWidth = Math.max(
        96,
        rightActionCount * (HEADER_ICON_BUTTON_SIZE + 4)
    )

    return (
        <Box
            style={{
                backgroundColor: colors.card,
                borderBottomColor: colors.border,
            }}
            className="border-b"
        >
            <HStack className="h-14 items-center justify-between px-3">
                <HStack
                    className="items-center gap-0.5"
                    style={{ minWidth: rightMinWidth }}
                >
                    {showBack ? (
                        <HeaderIconButton
                            onPress={() => router.back()}
                            accessibilityLabel="Go back"
                        >
                            <ArrowLeft
                                size={HEADER_ICON_SIZE_LARGE}
                                color={colors.primary}
                            />
                        </HeaderIconButton>
                    ) : showMenu ? (
                        <HeaderIconButton
                            onPress={openDrawer}
                            accessibilityLabel="Open menu"
                        >
                            <Menu
                                size={HEADER_ICON_SIZE_LARGE}
                                color={colors.primary}
                            />
                        </HeaderIconButton>
                    ) : (
                        <Box
                            style={{
                                width: HEADER_ICON_BUTTON_SIZE,
                                height: HEADER_ICON_BUTTON_SIZE,
                            }}
                        />
                    )}
                </HStack>

                <Text
                    className="flex-1 text-center text-lg font-semibold"
                    style={{ color: colors.foreground }}
                    numberOfLines={1}
                >
                    {title}
                </Text>

                <HStack
                    className="items-center justify-end gap-0.5"
                    style={{ minWidth: rightMinWidth }}
                >
                    {onTogglePhotosViewMode ? (
                        <HeaderIconButton
                            onPress={onTogglePhotosViewMode}
                            accessibilityLabel={
                                photosViewMode === "grid"
                                    ? "Switch to list view"
                                    : "Switch to grid view"
                            }
                        >
                            {photosViewMode === "grid" ? (
                                <List
                                    size={HEADER_ICON_SIZE}
                                    color={colors.mutedForeground}
                                />
                            ) : (
                                <LayoutGrid
                                    size={HEADER_ICON_SIZE}
                                    color={colors.mutedForeground}
                                />
                            )}
                        </HeaderIconButton>
                    ) : null}
                    {showSearch ? (
                        <HeaderIconButton
                            onPress={() =>
                                router.push("/campus-services" as Href)
                            }
                            accessibilityLabel="Search"
                        >
                            <Search
                                size={HEADER_ICON_SIZE}
                                color={colors.mutedForeground}
                            />
                        </HeaderIconButton>
                    ) : null}
                    {onExportPdfPress ? (
                        <HeaderIconButton
                            onPress={onExportPdfPress}
                            disabled={exportPdfDisabled}
                            accessibilityLabel="Export collection as PDF"
                        >
                            <FileDown
                                size={HEADER_ICON_SIZE}
                                color={colors.mutedForeground}
                            />
                        </HeaderIconButton>
                    ) : null}
                    {showSettings ? (
                        <HeaderIconButton
                            onPress={
                                onSettingsPress ??
                                (() => router.push("/settings" as Href))
                            }
                            accessibilityLabel="Settings"
                        >
                            <Settings
                                size={HEADER_ICON_SIZE}
                                color={colors.mutedForeground}
                            />
                        </HeaderIconButton>
                    ) : null}
                    {showNotifications ? (
                        <HeaderIconButton
                            onPress={() =>
                                router.push("/announcements" as Href)
                            }
                            accessibilityLabel="Notifications"
                        >
                            <Bell
                                size={HEADER_ICON_SIZE}
                                color={colors.mutedForeground}
                            />
                        </HeaderIconButton>
                    ) : null}
                </HStack>
            </HStack>
        </Box>
    )
}
