import { type FC } from "react"
import { ActivityIndicator } from "react-native"

import { Center } from "@/components/ui/center"
import { useThemeColors } from "@/hooks/use-theme-colors"

interface DefaultSpinnerProps {
    centered?: boolean
}

/**
 * Default loading spinner shown by ContentLoader when no customLoader is provided.
 */
export const DefaultSpinner: FC<DefaultSpinnerProps> = ({
    centered = false,
}) => {
    const { primary } = useThemeColors()

    return (
        <Center
            className={centered ? "w-full py-8" : "h-[70%] min-h-[200px]"}
            accessibilityRole="progressbar"
            accessibilityLabel="Loading"
        >
            <ActivityIndicator size="large" color={primary} />
        </Center>
    )
}
