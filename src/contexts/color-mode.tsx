import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react"

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider"

type ColorMode = "light" | "dark"

type ColorModeContextValue = {
    colorMode: ColorMode
    toggleColorMode: () => void
}

const ColorModeContext = createContext<ColorModeContextValue | null>(null)

export function ColorModeProvider({ children }: { children: ReactNode }) {
    const [colorMode, setColorMode] = useState<ColorMode>("light")

    const toggleColorMode = useCallback(() => {
        setColorMode((mode) => (mode === "light" ? "dark" : "light"))
    }, [])

    const value = useMemo(
        () => ({ colorMode, toggleColorMode }),
        [colorMode, toggleColorMode]
    )

    return (
        <ColorModeContext.Provider value={value}>
            <GluestackUIProvider mode={colorMode}>{children}</GluestackUIProvider>
        </ColorModeContext.Provider>
    )
}

export function useColorMode() {
    const context = useContext(ColorModeContext)

    if (!context) {
        throw new Error("useColorMode must be used within ColorModeProvider")
    }

    return context
}
