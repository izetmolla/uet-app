import AsyncStorage from "@react-native-async-storage/async-storage"
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react"
import { useColorScheme as useSystemColorScheme } from "react-native"
import { StatusBar } from "expo-status-bar"

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider"

const THEME_STORAGE_KEY = "uet-app-theme-preference"

export type ThemePreference = "system" | "light" | "dark"
export type ColorMode = "light" | "dark"

type ColorModeContextValue = {
    themePreference: ThemePreference
    colorMode: ColorMode
    setThemePreference: (preference: ThemePreference) => void
    hydrated: boolean
}

const ColorModeContext = createContext<ColorModeContextValue | null>(null)

function resolveColorMode(
    preference: ThemePreference,
    systemScheme: string | null | undefined
): ColorMode {
    if (preference === "system") {
        return systemScheme === "dark" ? "dark" : "light"
    }

    return preference
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
    const systemScheme = useSystemColorScheme()
    const [themePreference, setThemePreferenceState] =
        useState<ThemePreference>("system")
    const [hydrated, setHydrated] = useState(false)

    const colorMode = useMemo(
        () => resolveColorMode(themePreference, systemScheme),
        [themePreference, systemScheme]
    )

    useEffect(() => {
        let mounted = true

        AsyncStorage.getItem(THEME_STORAGE_KEY)
            .then((stored) => {
                if (!mounted) return

                if (
                    stored === "system" ||
                    stored === "light" ||
                    stored === "dark"
                ) {
                    setThemePreferenceState(stored)
                }
            })
            .finally(() => {
                if (mounted) {
                    setHydrated(true)
                }
            })

        return () => {
            mounted = false
        }
    }, [])

    const setThemePreference = useCallback((preference: ThemePreference) => {
        setThemePreferenceState(preference)
        void AsyncStorage.setItem(THEME_STORAGE_KEY, preference)
    }, [])

    const value = useMemo(
        () => ({
            themePreference,
            colorMode,
            setThemePreference,
            hydrated,
        }),
        [themePreference, colorMode, setThemePreference, hydrated]
    )

    return (
        <ColorModeContext.Provider value={value}>
            <GluestackUIProvider mode={colorMode}>
                <StatusBar style={colorMode === "dark" ? "light" : "dark"} />
                {children}
            </GluestackUIProvider>
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
