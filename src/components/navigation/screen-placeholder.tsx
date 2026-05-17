import { Box } from "@/components/ui/box"
import { Center } from "@/components/ui/center"
import { Text } from "@/components/ui/text"

type ScreenPlaceholderProps = {
    title: string
    description?: string
}

export function ScreenPlaceholder({ title, description }: ScreenPlaceholderProps) {
    return (
        <Box className="flex-1 bg-background-50">
            <Center className="flex-1 px-6">
                <Text className="text-xl font-semibold text-typography-900">
                    {title}
                </Text>
                {description ? (
                    <Text className="mt-2 text-center text-typography-500">
                        {description}
                    </Text>
                ) : null}
            </Center>
        </Box>
    )
}
