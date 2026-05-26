import { useLocalSearchParams } from "expo-router"
import { Check, FileScan } from "lucide-react-native"
import { Pressable } from "react-native"

import { useScannerSettingsStore } from "@/components/scanner/settings-store"
import { AppHeader } from "@/components/navigation/app-header"
import {
    ScreenContentSafeArea,
    ScreenSafeArea,
} from "@/components/navigation/screen-safe-area"
import { getRouteParam } from "@/components/scan-documents/student-tab-shell"
import { Box } from "@/components/ui/box"
import { Heading } from "@/components/ui/heading"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import type { ScannerOptionId } from "@/types/student-scanner"

type OptionCardProps = {
    id: ScannerOptionId
    title: string
    description: string
    badge?: string
    selected: boolean
    onSelect: () => void
}

function OptionCard({
    title,
    description,
    badge,
    selected,
    onSelect,
}: OptionCardProps) {
    return (
        <Pressable
            onPress={onSelect}
            className="active:opacity-80"
            accessibilityRole="radio"
            accessibilityState={{ selected }}
        >
            <HStack
                className={`items-start gap-3 rounded-2xl border px-4 py-4 ${
                    selected
                        ? "border-primary-500 bg-primary-50"
                        : "border-outline-200 bg-background-0"
                }`}
            >
                <Box
                    className={`mt-0.5 h-5 w-5 items-center justify-center rounded-full border-2 ${
                        selected
                            ? "border-primary-500 bg-primary-500"
                            : "border-outline-300 bg-background-0"
                    }`}
                >
                    {selected ? <Check size={12} color="#ffffff" /> : null}
                </Box>
                <VStack className="min-w-0 flex-1" space="xs">
                    <HStack className="items-center gap-2">
                        <Text className="text-base font-semibold text-typography-900">
                            {title}
                        </Text>
                        {badge ? (
                            <Box className="rounded-full bg-amber-100 px-2 py-0.5">
                                <Text
                                    size="xs"
                                    className="font-medium text-amber-800"
                                >
                                    {badge}
                                </Text>
                            </Box>
                        ) : null}
                    </HStack>
                    <Text size="sm" className="text-typography-500">
                        {description}
                    </Text>
                </VStack>
            </HStack>
        </Pressable>
    )
}

export default function StudentSettingsScreen() {
    const { student_name } = useLocalSearchParams<{
        student_name?: string | string[]
    }>()
    const title = getRouteParam(student_name) ?? "Student"
    const selectedOption = useScannerSettingsStore((s) => s.selectedOption)
    const setSelectedOption = useScannerSettingsStore(
        (s) => s.setSelectedOption
    )

    return (
        <ScreenSafeArea>
            <AppHeader
                title={`${title} settings`}
                showBack
                showMenu={false}
                showSearch={false}
                showSettings={false}
                showNotifications={false}
            />
            <ScreenContentSafeArea>
                <Box className="flex-1 bg-background-50 px-4 py-6">
                    <VStack space="md">
                        <VStack space="xs">
                            <Heading size="sm" className="text-typography-900">
                                Scanning method
                            </Heading>
                            <Text className="text-typography-500">
                                Choose how pages are captured on Scan Now. Your
                                choice is saved on this device.
                            </Text>
                        </VStack>

                        <VStack space="sm">
                            <OptionCard
                                id="1"
                                title="Option 1 — Document scanner"
                                description="Native scanner with automatic edge detection and cropping."
                                selected={selectedOption === "1"}
                                onSelect={() => setSelectedOption("1")}
                            />
                            <OptionCard
                                id="2"
                                title="Option 2 — Camera"
                                description="Take photos with the in-app camera. More features coming soon."
                                badge="Coming soon"
                                selected={selectedOption === "2"}
                                onSelect={() => setSelectedOption("2")}
                            />
                        </VStack>

                        <HStack className="items-center gap-2 rounded-xl border border-outline-200 bg-background-0 px-3 py-3">
                            <FileScan size={18} color="#2e4d88" />
                            <Text size="sm" className="flex-1 text-typography-600">
                                Active: Option {selectedOption} · Scanned pages
                                appear under Documents.
                            </Text>
                        </HStack>
                    </VStack>
                </Box>
            </ScreenContentSafeArea>
        </ScreenSafeArea>
    )
}
