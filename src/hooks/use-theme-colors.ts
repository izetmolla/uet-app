import { useMemo } from "react"

import { useColorMode } from "@/contexts/color-mode"
import { brandColors, brandGradient } from "@/theme/brand-colors"

function rgb(value: string) {
    return `rgb(${value})`
}

export function useThemeColors() {
    const { colorMode } = useColorMode()

    return useMemo(() => {
        const palette = brandColors[colorMode]

        return {
            colorMode,
            foreground: rgb(palette.foreground),
            mutedForeground: rgb(palette.mutedForeground),
            card: rgb(palette.card),
            pageBackground: rgb(palette.pageBackground),
            border: rgb(palette.border),
            pressed: rgb(palette.pressed),
            primary: brandGradient.start,
            tabActive: brandGradient.start,
            tabInactive: rgb(palette.mutedForeground),
        }
    }, [colorMode])
}
