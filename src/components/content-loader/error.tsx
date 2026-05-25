import { type Href, usePathname, useRouter } from "expo-router"
import { AlertCircle, ArrowLeft, RotateCcw } from "lucide-react-native"
import { type FC } from "react"

import { Box } from "@/components/ui/box"
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button"
import { Center } from "@/components/ui/center"
import { Heading } from "@/components/ui/heading"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"

import type { ContentErrorShape } from "./types"

interface ContentErrorProps {
    minimal?: boolean
    error: Error | ContentErrorShape
    onRetry?: () => void
}

const getErrorMessage = (error: Error | ContentErrorShape) => {
    if (error instanceof Error) {
        return error.message || "Something went wrong while loading this page."
    }

    return error.message || "Something went wrong while loading this page."
}

const statusUiMap: Record<number, { title: string; hint: string }> = {
    400: {
        title: "Bad Request",
        hint: "Please review your input and try again.",
    },
    401: {
        title: "Unauthorized",
        hint: "Please sign in and try again.",
    },
    403: {
        title: "Forbidden",
        hint: "You do not have permission to perform this action.",
    },
    404: {
        title: "Not Found",
        hint: "The resource you requested could not be found.",
    },
    409: {
        title: "Conflict",
        hint: "This action conflicts with the current state.",
    },
    422: {
        title: "Validation Error",
        hint: "Some fields are invalid. Please verify and retry.",
    },
    429: {
        title: "Too Many Requests",
        hint: "Too many attempts. Please wait and try again.",
    },
    500: {
        title: "Server Error",
        hint: "Something failed on our side. Please try again shortly.",
    },
    503: {
        title: "Service Unavailable",
        hint: "The service is temporarily unavailable.",
    },
}

const statusCodeFromError = (
    error: Error | ContentErrorShape
): number | null => {
    if (!(error instanceof Error)) {
        if (typeof error.status === "number") return error.status
        if (typeof error.code === "string") {
            const parsed = Number(error.code)
            if (Number.isInteger(parsed) && parsed >= 100 && parsed <= 599) {
                return parsed
            }
        }
    }
    return null
}

const ContentError: FC<ContentErrorProps> = ({
    error,
    minimal = false,
    onRetry,
}) => {
    const router = useRouter()
    const pathname = usePathname()

    const message = getErrorMessage(error)
    const code = "code" in error && error.code ? error.code : null
    const details =
        "details" in error && error.details ? String(error.details) : null
    const statusCode = statusCodeFromError(error)
    const mappedStatus = statusCode ? statusUiMap[statusCode] : null
    const title = mappedStatus?.title ?? "Error"
    const hint =
        mappedStatus?.hint ??
        "We could not complete your request. Please try again."

    const handleRetry = () => {
        if (onRetry) {
            onRetry()
            return
        }
        router.replace(pathname as Href)
    }

    if (minimal) {
        return (
            <Text size="sm" className="text-error-600">
                Error: {message}
            </Text>
        )
    }

    return (
        <Center className="flex-1 bg-background-50 p-4">
            <Box className="w-full max-w-2xl rounded-2xl border border-outline-200 bg-background-0 p-6">
                <VStack space="md" className="items-center">
                    <Box className="rounded-full bg-error-100 p-3">
                        <AlertCircle size={24} color="#dc2626" />
                    </Box>

                    <VStack space="xs" className="items-center">
                        <Heading
                            size="lg"
                            className="text-center text-error-600"
                        >
                            {title}
                        </Heading>
                        <Text
                            size="sm"
                            className="text-center text-typography-500"
                        >
                            {hint}
                        </Text>
                    </VStack>

                    <Box className="w-full rounded-xl border border-outline-100 bg-background-muted p-4">
                        <Text className="text-center text-typography-800">
                            {message}
                        </Text>
                    </Box>

                    {(statusCode || code || details) && (
                        <Box className="w-full rounded-lg border border-outline-100 bg-background-muted p-3">
                            {statusCode ? (
                                <Text size="sm" className="font-semibold">
                                    Status: {statusCode}
                                </Text>
                            ) : null}
                            {code ? (
                                <Text size="sm" className="font-semibold">
                                    Code: {code}
                                </Text>
                            ) : null}
                            {details ? (
                                <Text
                                    size="sm"
                                    className="mt-1 text-typography-500"
                                >
                                    Details: {details}
                                </Text>
                            ) : null}
                        </Box>
                    )}

                    <HStack space="sm" className="flex-wrap justify-center">
                        <Button action="primary" onPress={handleRetry}>
                            <ButtonIcon as={RotateCcw} className="text-white" />
                            <ButtonText>Retry</ButtonText>
                        </Button>
                        <Button
                            variant="outline"
                            action="secondary"
                            onPress={() => router.back()}
                        >
                            <ButtonIcon
                                as={ArrowLeft}
                                className="text-typography-700"
                            />
                            <ButtonText>Back</ButtonText>
                        </Button>
                    </HStack>
                </VStack>
            </Box>
        </Center>
    )
}

export default ContentError
