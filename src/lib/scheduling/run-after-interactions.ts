import InteractionManagerPolyfill from "@/lib/polyfills/interaction-manager"

/**
 * Schedule work after interactions/animations (app code should use this
 * instead of importing InteractionManager from react-native).
 */
export const runAfterInteractions =
    InteractionManagerPolyfill.runAfterInteractions.bind(
        InteractionManagerPolyfill
    )

export default InteractionManagerPolyfill
