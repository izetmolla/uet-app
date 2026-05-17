const path = require("path")
const { getDefaultConfig } = require("expo/metro-config")
const { withNativeWind } = require("nativewind/metro")

const config = getDefaultConfig(__dirname)

const interactionManagerPolyfill = path.resolve(
    __dirname,
    "src/lib/polyfills/interaction-manager.ts"
)

const configWithNativeWind = withNativeWind(config, { input: "./src/global.css" })

const previousResolveRequest = configWithNativeWind.resolver.resolveRequest

configWithNativeWind.resolver.resolveRequest = (
    context,
    moduleName,
    platform
) => {
    if (
        moduleName === "react-native/Libraries/Interaction/InteractionManager" ||
        moduleName.endsWith("/Libraries/Interaction/InteractionManager")
    ) {
        return {
            filePath: interactionManagerPolyfill,
            type: "sourceFile",
        }
    }

    if (previousResolveRequest) {
        return previousResolveRequest(context, moduleName, platform)
    }

    return context.resolveRequest(context, moduleName, platform)
}

module.exports = configWithNativeWind
