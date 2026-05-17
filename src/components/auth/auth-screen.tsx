import type { ReactNode } from "react"
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { authCardClassName, authPageClassName } from "@/components/auth/auth-styles"
import { Box } from "@/components/ui/box"
import { Center } from "@/components/ui/center"

type AuthScreenProps = {
    children: ReactNode
}

export function AuthScreen({ children }: AuthScreenProps) {
    return (
        <Box className={authPageClassName}>
            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <ScrollView
                        className="flex-1"
                        contentContainerClassName="grow justify-center p-4"
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <Center>
                            <Box className={authCardClassName}>{children}</Box>
                        </Center>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Box>
    )
}
