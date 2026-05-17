import { LinearGradient } from "expo-linear-gradient"
import { ActivityIndicator, Pressable, Text } from "react-native"

import {
    brandGlowShadow,
    brandGradient,
    brandGradientDisabled,
} from "@/theme/brand-colors"

type AuthPrimaryButtonProps = {
    label: string
    loading?: boolean
    disabled?: boolean
    onPress: () => void
}

export function AuthPrimaryButton({
    label,
    loading = false,
    disabled = false,
    onPress,
}: AuthPrimaryButtonProps) {
    const isDisabled = disabled || loading

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            accessibilityRole="button"
            accessibilityState={{ disabled: isDisabled }}
            className="w-full active:opacity-90"
        >
            <LinearGradient
                colors={
                    isDisabled
                        ? [
                              brandGradientDisabled.start,
                              brandGradientDisabled.end,
                          ]
                        : [brandGradient.start, brandGradient.end]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    {
                        height: 40,
                        borderRadius: 6,
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                    },
                    isDisabled ? undefined : brandGlowShadow,
                ]}
            >
                {loading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                    <Text
                        className={`text-base font-normal ${isDisabled ? "text-white/90" : "text-white"}`}
                    >
                        {label}
                    </Text>
                )}
            </LinearGradient>
        </Pressable>
    )
}
