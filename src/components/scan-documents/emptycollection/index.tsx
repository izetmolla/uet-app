import { ScanLine } from "lucide-react-native"
import { ActivityIndicator } from "react-native"

import { Box } from "@/components/ui/box"
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"

type EmptyCollectionProps = {
    message?: string
    description?: string
    onScanPress: () => void
    scanning?: boolean
    scanButtonLabel?: string
    onGoBack?: () => void
}

export function EmptyCollection({
    message = "Collection not found",
    description = "Scan documents to create a collection for this student.",
    onScanPress,
    scanning = false,
    scanButtonLabel = "Start scanning",
    onGoBack,
}: EmptyCollectionProps) {
    return (
        <Box className="flex-1 items-center justify-center bg-background-50 px-6">
            <VStack className="max-w-sm items-center gap-6">
                <Box className="h-20 w-20 items-center justify-center rounded-full bg-primary-100">
                    <ScanLine size={36} color="#5358ee" strokeWidth={1.75} />
                </Box>

                <VStack className="items-center gap-2">
                    <Text className="text-center text-lg font-semibold text-typography-900">
                        {message}
                    </Text>
                    {description ? (
                        <Text className="text-center text-sm text-typography-500">
                            {description}
                        </Text>
                    ) : null}
                </VStack>

                <Button
                    size="lg"
                    action="primary"
                    onPress={onScanPress}
                    isDisabled={scanning}
                    className="min-w-[200px] bg-primary-500"
                >
                    {scanning ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <>
                            <ButtonIcon as={ScanLine} className="text-white" />
                            <ButtonText>{scanButtonLabel}</ButtonText>
                        </>
                    )}
                </Button>

                {onGoBack ? (
                    <Button variant="link" onPress={onGoBack}>
                        <ButtonText>Go back</ButtonText>
                    </Button>
                ) : null}
            </VStack>
        </Box>
    )
}
