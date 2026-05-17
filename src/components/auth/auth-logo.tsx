import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { Pressable, View } from "react-native"

import { Heading } from "@/components/ui/heading"
import { Image } from "@/components/ui/image"
import { HStack } from "@/components/ui/hstack"
import { logoGradient } from "@/theme/brand-colors"

export function AuthLogo() {
    const router = useRouter()

    return (
        <Pressable
            onPress={() => router.replace("/login")}
            className="flex-row items-center gap-3"
            accessibilityRole="button"
            accessibilityLabel="UET App home"
        >
            <View className="relative">
                <LinearGradient
                    colors={[logoGradient.start, logoGradient.end]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        height: 40,
                        width: 40,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.15,
                        shadowRadius: 4,
                        elevation: 4,
                    }}
                >
                    <Image
                        size="none"
                        source={require("@/assets/images/icon.png")}
                        alt="UET App"
                        className="h-7 w-7"
                    />
                </LinearGradient>
            </View>
            <Heading size="lg" className="tracking-tight text-typography-900">
                UET App
            </Heading>
        </Pressable>
    )
}
