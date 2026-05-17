import { type Href, useRouter } from "expo-router"
import { useState } from "react"
import { ActivityIndicator, Alert } from "react-native"
import { ScanLine } from "lucide-react-native"

import { CamscanShell } from "@/components/camscan/camscan-shell"
import { Box } from "@/components/ui/box"
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Input, InputField } from "@/components/ui/input"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import {
    isDocumentScannerAvailable,
    scanDocuments,
} from "@/lib/camscan/scanner"
import { useCamscanStore } from "@/store/camscan-store"

const scannerAvailable = isDocumentScannerAvailable()

export default function CamscanScanScreen() {
    const router = useRouter()
    const createItemFromScan = useCamscanStore((s) => s.createItemFromScan)
    const [title, setTitle] = useState("")
    const [scanning, setScanning] = useState(false)

    const handleScan = async () => {
        setScanning(true)

        try {
            const images = await scanDocuments()

            if (images.length === 0) {
                return
            }

            const itemId = await createItemFromScan(
                images,
                title.trim() || undefined
            )

            setTitle("")
            router.push(`/camscan/${itemId}` as Href)
        } catch {
            Alert.alert("Scan failed", "Could not save scanned documents.")
        } finally {
            setScanning(false)
        }
    }

    return (
        <CamscanShell>
            <Box className="flex-1 bg-background-50 p-4">
                <VStack className="gap-6">
                    <VStack
                        className="rounded-xl border border-outline-200 bg-background-0 p-5"
                        space="md"
                    >
                        <VStack space="xs">
                            <Heading size="lg" className="text-typography-900">
                                Document scanner
                            </Heading>
                            <Text className="text-typography-500">
                                Capture notes, receipts, or any rectangular
                                document. Photos are saved to your library on
                                this device.
                            </Text>
                            {!scannerAvailable ? (
                                <Text
                                    size="sm"
                                    className="text-warning-600"
                                >
                                    Scanner requires a development build (not
                                    Expo Go). Run prebuild and run:android after
                                    installing the plugin.
                                </Text>
                            ) : null}
                        </VStack>

                        <VStack space="xs">
                            <Text size="sm" className="text-typography-500">
                                Collection name (optional)
                            </Text>
                            <Input variant="outline" size="md">
                                <InputField
                                    placeholder="e.g. Lecture notes"
                                    value={title}
                                    onChangeText={setTitle}
                                    editable={!scanning}
                                />
                            </Input>
                        </VStack>

                        <Button
                            size="lg"
                            action="primary"
                            onPress={handleScan}
                            isDisabled={scanning}
                            className="bg-primary-500"
                        >
                            {scanning ? (
                                <ActivityIndicator color="#ffffff" />
                            ) : (
                                <>
                                    <ButtonIcon
                                        as={ScanLine}
                                        className="text-white"
                                    />
                                    <ButtonText>Start scanning</ButtonText>
                                </>
                            )}
                        </Button>
                    </VStack>

                    <Text size="sm" className="text-center text-typography-400">
                        Powered by{" "}
                        <Text className="text-primary-500">
                            react-native-document-scanner-plugin
                        </Text>
                    </Text>
                </VStack>
            </Box>
        </CamscanShell>
    )
}
