import { Box } from "@/components/ui/box"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"

export function AuthSeparator({ label = "or" }: { label?: string }) {
    return (
        <HStack className="items-center gap-3 py-1">
            <Box className="h-px flex-1 border-t border-outline-200" />
            <Text size="sm" className="shrink-0 text-typography-500">
                {label}
            </Text>
            <Box className="h-px flex-1 border-t border-outline-200" />
        </HStack>
    )
}
