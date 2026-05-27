import { useEffect } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import Animated, {
    Easing,
    cancelAnimation,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated"

const OUTER_SIZE = 76
const INNER_SIZE = 56
const LOADING_RING_SIZE = OUTER_SIZE
const LOADING_BORDER = 3

type CaptureButtonProps = {
    isCapturing: boolean
    disabled?: boolean
    onPress: () => void
}

export function CaptureButton({
    isCapturing,
    disabled = false,
    onPress,
}: CaptureButtonProps) {
    const rotation = useSharedValue(0)

    useEffect(() => {
        if (isCapturing) {
            rotation.value = withRepeat(
                withTiming(360, {
                    duration: 850,
                    easing: Easing.linear,
                }),
                -1,
                false
            )
            return
        }

        cancelAnimation(rotation)
        rotation.value = withTiming(0, { duration: 180 })
    }, [isCapturing, rotation])

    const loadingRingStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }))

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || isCapturing}
            style={({ pressed }) => [
                styles.hitArea,
                pressed && !isCapturing && styles.hitAreaPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Capture photo"
            accessibilityState={{ busy: isCapturing, disabled }}
        >
            <View
                style={[
                    styles.outerRing,
                    isCapturing && styles.outerRingCapturing,
                ]}
            >
                {isCapturing ? (
                    <Animated.View
                        style={[styles.loadingRing, loadingRingStyle]}
                        pointerEvents="none"
                    />
                ) : null}

                <View
                    style={[
                        styles.innerDisc,
                        isCapturing && styles.innerDiscCapturing,
                    ]}
                />
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    hitArea: {
        width: OUTER_SIZE,
        height: OUTER_SIZE,
        alignItems: "center",
        justifyContent: "center",
    },
    hitAreaPressed: {
        transform: [{ scale: 0.96 }],
    },
    outerRing: {
        width: OUTER_SIZE,
        height: OUTER_SIZE,
        borderRadius: OUTER_SIZE / 2,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 4,
        borderColor: "rgba(255, 255, 255, 0.95)",
        backgroundColor: "rgba(255, 255, 255, 0.12)",
    },
    outerRingCapturing: {
        borderColor: "rgba(255, 255, 255, 0.2)",
        backgroundColor: "rgba(255, 255, 255, 0.06)",
    },
    loadingRing: {
        position: "absolute",
        width: LOADING_RING_SIZE,
        height: LOADING_RING_SIZE,
        borderRadius: LOADING_RING_SIZE / 2,
        borderWidth: LOADING_BORDER,
        borderColor: "transparent",
        borderTopColor: "#ffffff",
        borderRightColor: "rgba(255, 255, 255, 0.85)",
        borderBottomColor: "rgba(255, 255, 255, 0.15)",
        borderLeftColor: "rgba(255, 255, 255, 0.15)",
    },
    innerDisc: {
        width: INNER_SIZE,
        height: INNER_SIZE,
        borderRadius: INNER_SIZE / 2,
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    innerDiscCapturing: {
        opacity: 0.72,
        transform: [{ scale: 0.94 }],
    },
})
