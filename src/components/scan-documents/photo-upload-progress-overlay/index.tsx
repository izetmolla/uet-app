import { useEffect, useMemo, useRef, useState } from "react"
import { StyleSheet, View } from "react-native"
import { RotateCw, X } from "lucide-react-native"
import Svg, { Circle } from "react-native-svg"

import { Box } from "@/components/ui/box"
import { Button, ButtonIcon } from "@/components/ui/button"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { useGlobalUploadProgress } from "@/hooks/use-global-upload-progress"
import { useUploadPhotos } from "@/hooks/upload-photos"
import { useThemeColors } from "@/hooks/use-theme-colors"
import {
    cancelPhotoUploadBatch,
    dismissPhotoUploadSession,
    retryAllFailedPhotoUploads,
} from "@/lib/scan-documents/photo-upload-service"
import { useScanDocumentsStore } from "@/store/scan-documents"
import type { ScanDocumentsPhoto } from "@/types/scan-documents"

const EMPTY_PHOTOS: ScanDocumentsPhoto[] = []

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

type OverlayProgress = {
    studentId: string
    percent: number
    total: number
    uploadedCount: number
    failedCount: number
    inProgressCount: number
    isFinished: boolean
}

type PhotoUploadProgressOverlayProps = {
    studentId?: string
    folderId?: string
}

export function PhotoUploadProgressOverlay({
    studentId,
    folderId,
}: PhotoUploadProgressOverlayProps = {}) {
    const colors = useThemeColors()
    const [dismissed, setDismissed] = useState(false)
    const globalProgress = useGlobalUploadProgress()
    const {
        uploadSummary,
        cancelUploads,
        retryAllFailed,
        dismissUploadSession,
    } = useUploadPhotos({
        studentId: studentId ?? "",
        folderId,
    })

    const effectiveStudentId = studentId ?? globalProgress?.studentId ?? ""
    const studentPhotos = useScanDocumentsStore((s) => {
        if (!effectiveStudentId) return EMPTY_PHOTOS
        return s.getItem(effectiveStudentId)?.photos ?? EMPTY_PHOTOS
    })

    const progress: OverlayProgress | null = useMemo(() => {
        if (studentId) {
            if (!uploadSummary.hasVisibleSession) return null

            return {
                studentId,
                percent: uploadSummary.overallPercent,
                total: uploadSummary.total,
                uploadedCount: uploadSummary.uploadedCount,
                failedCount: uploadSummary.failedCount,
                inProgressCount: uploadSummary.uploadingCount,
                isFinished: uploadSummary.isFinished,
            }
        }

        return globalProgress
    }, [
        globalProgress,
        studentId,
        uploadSummary.hasVisibleSession,
        uploadSummary.overallPercent,
        uploadSummary.total,
        uploadSummary.uploadedCount,
        uploadSummary.failedCount,
        uploadSummary.uploadingCount,
        uploadSummary.isFinished,
    ])

    const activeBatchKeyRef = useRef<string | null>(null)

    useEffect(() => {
        if (!progress || progress.isFinished) return

        const batchKey = progress.studentId
        if (activeBatchKeyRef.current === batchKey) return

        activeBatchKeyRef.current = batchKey
        setDismissed(false)
    }, [progress?.isFinished, progress?.studentId])

    if (!progress || dismissed) {
        return null
    }

    const handleCancel = () => {
        activeBatchKeyRef.current = null

        if (studentId) {
            cancelUploads()
            dismissUploadSession()
            return
        }

        cancelPhotoUploadBatch(progress.studentId)
        dismissPhotoUploadSession(progress.studentId)
        setDismissed(true)
    }

    const handleRetryAll = () => {
        if (studentId) {
            retryAllFailed(studentPhotos)
            return
        }

        retryAllFailedPhotoUploads({
            studentId: progress.studentId,
            folderId,
            photos: studentPhotos,
        })
    }

    const handleClose = () => {
        activeBatchKeyRef.current = null

        if (studentId) {
            dismissUploadSession()
        } else {
            dismissPhotoUploadSession(progress.studentId)
        }
        setDismissed(true)
    }

    const isFinished = progress.isFinished
    const hasFailures = progress.failedCount > 0

    const title = isFinished
        ? hasFailures
            ? "Upload finished with errors"
            : "Upload complete"
        : "Uploading photos"

    const statusLine = isFinished
        ? hasFailures
            ? `${progress.failedCount} failed · ${progress.uploadedCount} uploaded`
            : "All photos uploaded"
        : progress.inProgressCount > 0
          ? `${progress.inProgressCount} in progress`
          : `${progress.uploadedCount + progress.failedCount} / ${progress.total} processed`

    return (
        <Box
            className="w-full border-b px-4 py-3"
            style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
            }}
            accessibilityRole="progressbar"
            accessibilityLabel={`${title}, ${progress.uploadedCount} of ${progress.total}, ${progress.percent} percent`}
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
                    progressColor={
                        isFinished && hasFailures ? "#dc2626" : colors.primary
                    }
                />

                <VStack className="min-w-0 flex-1 gap-1">
                    <Text className="text-sm font-semibold text-typography-900">
                        {title}
                    </Text>
                    <Text className="text-xs text-typography-500">
                        {progress.uploadedCount} / {progress.total} uploaded
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
                            onPress={handleRetryAll}
                            className="h-9 w-9 border-outline-300 px-0"
                            accessibilityLabel="Retry all failed uploads"
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
                            accessibilityLabel="Cancel upload"
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
