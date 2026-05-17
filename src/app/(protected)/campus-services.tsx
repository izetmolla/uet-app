import { StackScreen } from "@/components/navigation/stack-screen"
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"

const services = [
    "Library & study rooms",
    "Student transport",
    "IT help desk",
    "Career office",
    "Health center",
]

export default function CampusServicesScreen() {
    return (
        <StackScreen title="Campus services" showSearch={false}>
            <VStack className="gap-3 p-4">
                {services.map((service) => (
                    <Box
                        key={service}
                        className="rounded-xl border border-outline-200 bg-background-0 px-4 py-4"
                    >
                        <Text className="text-base text-typography-900">
                            {service}
                        </Text>
                    </Box>
                ))}
            </VStack>
        </StackScreen>
    )
}
