import { createContext, useContext } from "react"

export interface ContentLoaderContextValue {
    /** Current page title. */
    title: string
    /** Set the page title. Updates the header. */
    setTitle: (title: string) => void
    /** Current page description. */
    description: string
    /** Set the page description. Updates the header. */
    setDescription: (description: string) => void
}

export const ContentLoaderContext =
    createContext<ContentLoaderContextValue | null>(null)

/**
 * Hook to read and update the ContentLoader page title and description from any child.
 * Must be used inside a ContentLoader.
 */
export function useContentLoader(): ContentLoaderContextValue {
    const ctx = useContext(ContentLoaderContext)
    if (ctx == null) {
        throw new Error("useContentLoader must be used within a ContentLoader")
    }
    return ctx
}

/**
 * Optional hook: returns the context value or null if outside ContentLoader.
 */
export function useContentLoaderOptional(): ContentLoaderContextValue | null {
    return useContext(ContentLoaderContext)
}
