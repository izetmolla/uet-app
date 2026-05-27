import { Upload } from "lucide-react-native"

import { Box } from "@/components/ui/box"
import { Button, ButtonText } from "@/components/ui/button"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { useThemeColors } from "@/hooks/use-theme-colors"

type PhotoUploadBannerProps = {
    uploadingCount: number
    total: number
    completedCount: number
    onCancel: () => void
}

export function PhotoUploadBanner({
    uploadingCount,
    total,
    completedCount,
    onCancel,
}: PhotoUploadBannerProps) {
    const colors = useThemeColors()

    const inFlight = Math.max(uploadingCount, total - completedCount)

    return (
        <Box
            className="mx-4 mb-3 rounded-xl border border-outline-200 bg-background-0 px-4 py-3 shadow-sm"
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
                elevation: 3,
            }}
        >
            <HStack className="items-center justify-between gap-3">
                <HStack className="flex-1 items-center gap-3">
                    <Box className="rounded-full bg-primary-100 p-2">
                        <Upload size={18} color={colors.primary} />
                    </Box>
                    <Box className="flex-1">
                        <Text className="text-sm font-semibold text-typography-900">
                            Uploading in background
                        </Text>
                        <Text className="text-xs text-typography-500">
                            {completedCount} of {total} done · {inFlight} in
                            progress
                        </Text>
                    </Box>
                </HStack>

                <Button
                    size="sm"
                    variant="outline"
                    action="secondary"
                    onPress={onCancel}
                    className="border-outline-300"
                >
                    <ButtonText>Cancel</ButtonText>
                </Button>
            </HStack>
        </Box>
    )
}
