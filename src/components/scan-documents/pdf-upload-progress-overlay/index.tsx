import { useEffect, useMemo, useRef, useState } from "react"
import { StyleSheet, View } from "react-native"
import { RotateCw, X } from "lucide-react-native"
import Svg, { Circle } from "react-native-svg"

import { Box } from "@/components/ui/box"
import { Button, ButtonIcon } from "@/components/ui/button"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { useUploadPdf } from "@/hooks/upload-pdf"
import { useThemeColors } from "@/hooks/use-theme-colors"

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

type PdfUploadProgressOverlayProps = {
    studentId: string
    folderId?: string
}

export function PdfUploadProgressOverlay({
    studentId,
    folderId,
}: PdfUploadProgressOverlayProps) {
    const colors = useThemeColors()
    const [dismissed, setDismissed] = useState(false)
    const { uploadSummary, cancelUpload, dismissUploadSession, retryPdf } =
        useUploadPdf({ studentId, folderId })

    const activeBatchKeyRef = useRef<string | null>(null)

    const progress = useMemo(() => {
        if (!uploadSummary.hasVisibleSession) return null

        return uploadSummary
    }, [uploadSummary])

    useEffect(() => {
        if (!progress || progress.isFinished) return

        const batchKey = progress.currentPdfId ?? studentId
        if (activeBatchKeyRef.current === batchKey) return

        activeBatchKeyRef.current = batchKey
        setDismissed(false)
    }, [progress?.currentPdfId, progress?.isFinished, studentId])

    if (!progress || dismissed) {
        return null
    }

    const isFinished = progress.isFinished
    const hasFailures = progress.failedCount > 0
    const isGenerating = progress.phase === "generating"

    const title = isFinished
        ? hasFailures
            ? "PDF upload failed"
            : "PDF uploaded"
        : isGenerating
          ? "Generating PDF"
          : "Uploading PDF"

    const statusLine = isFinished
        ? hasFailures
            ? "Tap retry to try again"
            : "Ready on server"
        : isGenerating
          ? "Building document from photos…"
          : "Sending to server…"

    const handleCancel = () => {
        activeBatchKeyRef.current = null
        cancelUpload()
        dismissUploadSession()
    }

    const handleRetry = () => {
        if (progress.currentPdfId) {
            retryPdf(progress.currentPdfId)
        }
    }

    const handleClose = () => {
        activeBatchKeyRef.current = null
        dismissUploadSession()
        setDismissed(true)
    }

    return (
        <Box
            className="w-full border-b px-4 py-3"
            style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
            }}
        >
            <HStack className="items-center gap-3">
                <UploadProgressRing
                    percent={progress.overallPercent}
                    trackColor={colors.border}
                    progressColor={
                        isFinished && hasFailures ? "#dc2626" : colors.primary
                    }
                />

                <VStack className="min-w-0 flex-1 gap-1">
                    <Text className="text-sm font-semibold text-typography-900">
                        {title}
                    </Text>
                    <Text className="text-[11px] text-typography-400">
                        {statusLine}
                    </Text>
                </VStack>

                <HStack className="shrink-0 items-center gap-1">
                    {isFinished && hasFailures ? (
                        <Button
                            size="sm"
                            variant="outline"
                            action="secondary"
                            onPress={handleRetry}
                            className="h-9 w-9 border-outline-300 px-0"
                            accessibilityLabel="Retry PDF upload"
                        >
                            <ButtonIcon
                                as={RotateCw}
                                className="text-typography-700"
                            />
                        </Button>
                    ) : null}

                    {isFinished ? (
                        <Button
                            size="sm"
                            variant="outline"
                            action="secondary"
                            onPress={handleClose}
                            className="h-9 w-9 border-outline-300 px-0"
                            accessibilityLabel="Close"
                        >
                            <ButtonIcon
                                as={X}
                                className="text-typography-700"
                            />
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            variant="outline"
                            action="secondary"
                            onPress={handleCancel}
                            className="h-9 w-9 border-outline-300 px-0"
                            accessibilityLabel="Cancel PDF upload"
                        >
                            <ButtonIcon
                                as={X}
                                className="text-typography-700"
                            />
                        </Button>
                    )}
                </HStack>
            </HStack>
        </Box>
    )
}

const styles = StyleSheet.create({
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
