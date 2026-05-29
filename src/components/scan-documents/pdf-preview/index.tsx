import * as Sharing from "expo-sharing"
import { useCallback, useEffect, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    Platform,
    StyleSheet,
} from "react-native"
import { WebView } from "react-native-webview"
import { Share2 } from "lucide-react-native"

import {
    HEADER_ICON_SIZE_LARGE,
    HeaderIconButton,
} from "@/components/scan-documents/header/header-icon-button"
import { AppHeader } from "@/components/navigation/app-header"
import { ScreenContentSafeArea, ScreenSafeArea } from "@/components/navigation/screen-safe-area"
import { Box } from "@/components/ui/box"
import { Button, ButtonText } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { useThemeColors } from "@/hooks/use-theme-colors"
import { resolvePdfViewerUri } from "@/lib/scan-documents/resolve-pdf-viewer-uri"

type PdfPreviewProps = {
    title: string
    uri: string
    onClose: () => void
}

export function PdfPreview({ title, uri, onClose }: PdfPreviewProps) {
    const colors = useThemeColors()
    const [viewerUri, setViewerUri] = useState<string | null>(null)
    const [loadError, setLoadError] = useState(false)
    const [isResolving, setIsResolving] = useState(true)

    useEffect(() => {
        let cancelled = false

        void (async () => {
            setIsResolving(true)
            setLoadError(false)

            try {
                const resolved = await resolvePdfViewerUri(uri)
                if (!cancelled) {
                    setViewerUri(resolved)
                }
            } catch {
                if (!cancelled) {
                    setLoadError(true)
                }
            } finally {
                if (!cancelled) {
                    setIsResolving(false)
                }
            }
        })()

        return () => {
            cancelled = true
        }
    }, [uri])

    const handleShare = useCallback(async () => {
        try {
            const canShare = await Sharing.isAvailableAsync()
            if (!canShare) {
                Alert.alert(
                    "Sharing unavailable",
                    "PDF sharing is not supported on this device."
                )
                return
            }

            await Sharing.shareAsync(uri, {
                UTI: "com.adobe.pdf",
                mimeType: "application/pdf",
                dialogTitle: title,
            })
        } catch {
            Alert.alert("Could not share", "Unable to open the share sheet.")
        }
    }, [title, uri])

    const handleOpenExternal = useCallback(async () => {
        await handleShare()
    }, [handleShare])

    return (
        <ScreenSafeArea>
            <AppHeader title={title} showBack showMenu={false} showSearch={false} showSettings={false} showNotifications={false} />
            <ScreenContentSafeArea>
                <Box className="flex-1 bg-background-50">
                    <Box className="flex-row justify-end border-b border-outline-200 bg-background-0 px-3 py-2">
                        <HeaderIconButton
                            onPress={handleShare}
                            accessibilityLabel="Share PDF"
                        >
                            <Share2
                                size={HEADER_ICON_SIZE_LARGE}
                                color={colors.primary}
                            />
                        </HeaderIconButton>
                    </Box>

                    {isResolving ? (
                        <Box className="flex-1 items-center justify-center">
                            <ActivityIndicator
                                size="large"
                                color={colors.primary}
                            />
                            <Text className="mt-3 text-typography-500">
                                Loading preview…
                            </Text>
                        </Box>
                    ) : loadError || !viewerUri ? (
                        <VStack className="flex-1 items-center justify-center px-6">
                            <Text className="text-center text-typography-900">
                                Could not open this PDF in the app.
                            </Text>
                            <Text className="mt-2 text-center text-typography-500">
                                Open it with another app on your device instead.
                            </Text>
                            <Button
                                size="md"
                                action="primary"
                                onPress={handleOpenExternal}
                                className="mt-6 bg-primary-500"
                            >
                                <ButtonText>Open PDF</ButtonText>
                            </Button>
                            <Button
                                size="md"
                                variant="outline"
                                action="secondary"
                                onPress={onClose}
                                className="mt-3"
                            >
                                <ButtonText>Go back</ButtonText>
                            </Button>
                        </VStack>
                    ) : (
                        <WebView
                            source={{ uri: viewerUri }}
                            style={styles.webview}
                            originWhitelist={["*"]}
                            allowingReadAccessToURL={
                                Platform.OS === "ios" ? uri : undefined
                            }
                            onError={() => setLoadError(true)}
                            onHttpError={() => setLoadError(true)}
                            startInLoadingState
                            renderLoading={() => (
                                <Box className="flex-1 items-center justify-center">
                                    <ActivityIndicator
                                        size="large"
                                        color={colors.primary}
                                    />
                                </Box>
                            )}
                        />
                    )}
                </Box>
            </ScreenContentSafeArea>
        </ScreenSafeArea>
    )
}

const styles = StyleSheet.create({
    webview: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
})
