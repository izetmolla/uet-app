import { StyleSheet, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Svg, { Circle } from "react-native-svg"

import { Box } from "@/components/ui/box"
import { Button, ButtonText } from "@/components/ui/button"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { useGlobalUploadProgress } from "@/hooks/use-global-upload-progress"
import { useThemeColors } from "@/hooks/use-theme-colors"
import { cancelPhotoUploadBatch } from "@/lib/scan-documents/photo-upload-service"

const RING_SIZE = 48
const STROKE_WIDTH = 4
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

type UploadProgressRingProps = {
    percent: number
    trackColor: string
    progressColor: string
}

function UploadProgressRing({
    percent,
    trackColor,
    progressColor,
}: UploadProgressRingProps) {
    const strokeDashoffset =
        CIRCUMFERENCE - (CIRCUMFERENCE * percent) / 100

    return (
        <View style={styles.ring}>
            <Svg width={RING_SIZE} height={RING_SIZE}>
                <Circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RADIUS}
                    stroke={trackColor}
                    strokeWidth={STROKE_WIDTH}
                    fill="transparent"
                />
                <Circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RADIUS}
                    stroke={progressColor}
                    strokeWidth={STROKE_WIDTH}
                    fill="transparent"
                    strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
                />
            </Svg>
            <View style={styles.ringLabel} pointerEvents="none">
                <Text className="text-[10px] font-bold text-typography-900">
                    {percent}%
                </Text>
            </View>
        </View>
    )
}

export function PhotoUploadProgressOverlay() {
    const insets = useSafeAreaInsets()
    const colors = useThemeColors()
    const progress = useGlobalUploadProgress()

    if (!progress) {
        return null
    }

    const handleCancel = () => {
        cancelPhotoUploadBatch(progress.studentId)
    }

    const statusLine =
        progress.failedCount > 0
            ? `${progress.failedCount} failed`
            : progress.inProgressCount > 0
              ? `${progress.inProgressCount} in progress`
              : "Finishing…"

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <Box
                pointerEvents="auto"
                style={[
                    styles.card,
                    {
                        top: insets.top + 8,
                        left: Math.max(insets.left, 12),
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                    },
                ]}
                accessibilityRole="progressbar"
                accessibilityLabel={`Uploading photos, ${progress.uploadedCount} of ${progress.total}, ${progress.percent} percent`}
                accessibilityValue={{
                    min: 0,
                    max: progress.total,
                    now: progress.uploadedCount,
                }}
            >
                <HStack className="items-center gap-3">
                    <UploadProgressRing
                        percent={progress.percent}
                        trackColor={colors.border}
                        progressColor={colors.primary}
                    />

                    <VStack className="min-w-0 flex-1 gap-1">
                        <Text className="text-sm font-semibold text-typography-900">
                            Uploading photos
                        </Text>
                        <Text className="text-xs text-typography-500">
                            {progress.uploadedCount} / {progress.total} uploaded
                        </Text>
                        <Text className="text-[11px] text-typography-400">
                            {statusLine}
                        </Text>
                    </VStack>
                </HStack>

                <Button
                    size="sm"
                    variant="outline"
                    action="secondary"
                    onPress={handleCancel}
                    className="mt-3 border-outline-300"
                >
                    <ButtonText>Cancel</ButtonText>
                </Button>
            </Box>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        position: "absolute",
        zIndex: 100,
        maxWidth: 280,
        borderRadius: 14,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 6,
    },
    ring: {
        width: RING_SIZE,
        height: RING_SIZE,
        alignItems: "center",
        justifyContent: "center",
    },
    ringLabel: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
    },
})
