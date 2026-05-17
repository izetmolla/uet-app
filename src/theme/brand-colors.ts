/**
 * RGB tokens converted from uetapp-v3 `general` theme (oklch in global.css / themes.css).
 * Used by GlueStack config and auth UI.
 */
export const brandColors = {
    light: {
        pageBackground: "250 252 254",
        card: "255 255 255",
        foreground: "14 17 27",
        mutedForeground: "89 93 105",
        mutedBackground: "239 242 245",
        border: "235 235 235",
        inputBorder: "224 224 224",
        borderHover: "204 204 204",
        primary: {
            50: "252 252 252",
            100: "192 209 255",
            200: "143 161 255",
            300: "102 114 255",
            400: "96 105 255",
            500: "83 88 238",
            600: "72 77 210",
            700: "62 66 182",
            800: "48 53 139",
            900: "33 38 95",
        },
        secondary: {
            50: "245 249 250",
            100: "193 229 239",
            200: "133 210 229",
            300: "0 193 229",
            400: "0 175 213",
            500: "0 155 193",
            600: "0 141 173",
        },
    },
    dark: {
        pageBackground: "5 7 15",
        card: "12 15 24",
        foreground: "246 249 252",
        mutedForeground: "153 158 171",
    },
} as const

/** v3 `--gradient-brand` endpoints (135deg) */
export const brandGradient = {
    start: "#5358ee",
    end: "#009bc1",
} as const

/** Muted but opaque gradient for disabled CTA (reads solid, not washed out) */
export const brandGradientDisabled = {
    start: "#9498f2",
    end: "#5eb8d4",
} as const

/** v3 sign-in logo badge (green → blue) */
export const logoGradient = {
    start: "#22c55e",
    end: "#2563eb",
} as const

export const brandGlowShadow = {
    shadowColor: "#5358ee",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
} as const
