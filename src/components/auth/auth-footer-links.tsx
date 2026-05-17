import { Pressable } from "react-native"

import { authFooterLinkClassName } from "@/components/auth/auth-styles"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"

const links = ["Help", "Privacy", "Terms"] as const

export function AuthFooterLinks() {
    return (
        <HStack className="justify-start gap-6 pt-1">
            {links.map((label) => (
                <Pressable
                    key={label}
                    accessibilityRole="link"
                    accessibilityLabel={label}
                >
                    <Text className={authFooterLinkClassName}>{label}</Text>
                </Pressable>
            ))}
        </HStack>
    )
}
