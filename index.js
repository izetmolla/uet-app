/**
 * Patches React Native's deprecated InteractionManager export before any
 * navigation code loads, so dependencies receive a requestIdleCallback-based
 * implementation without triggering the RN 0.83 deprecation warning.
 */
const SplashScreen = require("expo-splash-screen")

void SplashScreen.preventAutoHideAsync()

const ReactNative = require("react-native")

Object.defineProperty(ReactNative, "InteractionManager", {
    configurable: true,
    enumerable: true,
    get() {
        return require("./src/lib/polyfills/interaction-manager").default
    },
})

require("expo-router/entry")
