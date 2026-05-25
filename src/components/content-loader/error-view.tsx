import { type FC, useMemo } from "react"

import { Box } from "@/components/ui/box"
import { Center } from "@/components/ui/center"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"

import type { ApiErrorResponse } from "./types"

interface ContentLoaderErrorViewProps {
    error: Error
    /** Compact layout for constrained areas (e.g. sidebar). */
    minimal?: boolean
    /** Fill parent and center content instead of using a fixed viewport height. */
    centered?: boolean
}

/**
 * Renders error message and optional API response details (message, code, details).
 * Used by ContentLoader in the error state and exported for reuse.
 */
export const ContentLoaderErrorView: FC<ContentLoaderErrorViewProps> = ({
    error,
    minimal = false,
    centered = false,
}) => {
    const apiResponse = useMemo((): ApiErrorResponse | null => {
        const response = (
            error as Error & { response?: { data?: ApiErrorResponse } }
        ).response?.data
        return response ?? null
    }, [error])

    if (minimal) {
        return (
            <Box className="px-2 py-1.5" accessibilityRole="alert">
                <Text size="xs" className="font-medium text-error-600">
                    {error.message}
                </Text>
                {apiResponse?.message &&
                apiResponse.message !== error.message ? (
                    <Text size="xs" className="mt-0.5 text-typography-500">
                        {apiResponse.message}
                    </Text>
                ) : null}
            </Box>
        )
    }

    return (
        <Center
            className={
                centered
                    ? "w-full px-4 py-8"
                    : "min-h-[70%] px-4 py-8"
            }
            accessibilityRole="alert"
        >
            <VStack space="xs" className="max-w-full items-center">
                <Text className="text-center font-medium text-error-600">
                    {error.message}
                </Text>
                {apiResponse?.message ? (
                    <Text size="sm" className="text-center text-typography-700">
                        {apiResponse.message}
                    </Text>
                ) : null}
                {apiResponse?.code ? (
                    <Text size="xs" className="text-typography-500">
                        {apiResponse.code}
                    </Text>
                ) : null}
                {apiResponse?.details != null ? (
                    <Box className="mt-2 max-w-full rounded-md bg-background-muted px-2 py-1">
                        <Text
                            size="xs"
                            className="font-mono text-typography-700"
                        >
                            {JSON.stringify(apiResponse.details, null, 2)}
                        </Text>
                    </Box>
                ) : null}
            </VStack>
        </Center>
    )
}
