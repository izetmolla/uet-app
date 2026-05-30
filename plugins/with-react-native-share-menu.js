const fs = require("node:fs")
const path = require("node:path")

const {
    withAndroidManifest,
    withAppDelegate,
    withDangerousMod,
    withEntitlementsPlist,
    withPodfile,
    withXcodeProject,
} = require("@expo/config-plugins")
const { mergeContents } = require("@expo/config-plugins/build/utils/generateCode")
const { build: buildPlist } = require("@expo/plist").default

const EXTENSION_NAME = "ShareExtension"
const TAG = "react-native-share-menu"

function getBundleIdentifier(config) {
    return config.ios?.bundleIdentifier ?? "com.izetmolla.uetapp"
}

function getAppGroup(bundleIdentifier) {
    return `group.${bundleIdentifier}`
}

function getUrlScheme(config) {
    return config.scheme ?? bundleIdentifierToScheme(getBundleIdentifier(config))
}

function bundleIdentifierToScheme(bundleIdentifier) {
    return bundleIdentifier
}

function withShareMenuPackagePatches(config) {
    return withDangerousMod(config, [
        "android",
        async (config) => {
            const projectRoot = config.modRequest.projectRoot
            const packageRoot = path.join(projectRoot, "node_modules/react-native-share-menu")
            const buildGradlePath = path.join(packageRoot, "android/build.gradle")
            const indexPath = path.join(packageRoot, "index.js")

            if (fs.existsSync(buildGradlePath)) {
                fs.writeFileSync(
                    buildGradlePath,
                    `apply plugin: 'com.android.library'

android {
    namespace "com.meedan"
    compileSdkVersion rootProject.ext.compileSdkVersion
    buildToolsVersion rootProject.ext.buildToolsVersion

    defaultConfig {
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0"
    }
    lintOptions {
       warning 'InvalidPackage'
    }
}

dependencies {
    //noinspection GradleDynamicVersion
    implementation 'com.facebook.react:react-native:+'
}
`,
                )
            }

            if (fs.existsSync(indexPath)) {
                fs.writeFileSync(
                    indexPath,
                    `import { NativeModules, NativeEventEmitter } from "react-native";

const { ShareMenu } = NativeModules;

function createShareMenuEventEmitter() {
  if (
    ShareMenu &&
    typeof ShareMenu.addListener === "function" &&
    typeof ShareMenu.removeListeners === "function"
  ) {
    return new NativeEventEmitter(ShareMenu);
  }

  return new NativeEventEmitter();
}

const EventEmitter = createShareMenuEventEmitter();

const NEW_SHARE_EVENT_NAME = "NewShareEvent";

export const ShareMenuReactView = {
  dismissExtension(error = null) {
    NativeModules.ShareMenuReactView.dismissExtension(error);
  },
  openApp() {
    NativeModules.ShareMenuReactView.openApp();
  },
  continueInApp(extraData = null) {
    NativeModules.ShareMenuReactView.continueInApp(extraData);
  },
  data() {
    return NativeModules.ShareMenuReactView.data();
  },
};

export default {
  /**
   * @deprecated Use \`getInitialShare\` instead. This is here for backwards compatibility.
   */
  getSharedText(callback) {
    this.getInitialShare(callback);
  },
  getInitialShare(callback) {
    ShareMenu.getSharedText(callback);
  },
  addNewShareListener(callback) {
    const subscription = EventEmitter.addListener(
      NEW_SHARE_EVENT_NAME,
      callback
    );

    return subscription;
  },
};
`,
                )
            }

            return config
        },
    ])
}

function withShareMenuAndroid(config) {
    return withAndroidManifest(config, (config) => {
        const manifest = config.modResults
        const application = manifest.manifest.application?.[0]

        if (!application?.activity) {
            return config
        }

        const mainActivity = application.activity.find(
            (activity) => activity.$?.["android:name"] === ".MainActivity",
        )

        if (!mainActivity) {
            return config
        }

        mainActivity.$ = {
            ...mainActivity.$,
            "android:documentLaunchMode": "never",
        }

        const intentFilters = [
            {
                action: [{ $: { "android:name": "android.intent.action.SEND" } }],
                category: [{ $: { "android:name": "android.intent.category.DEFAULT" } }],
                data: [
                    { $: { "android:mimeType": "text/plain" } },
                    { $: { "android:mimeType": "*/*" } },
                ],
            },
            {
                action: [{ $: { "android:name": "android.intent.action.SEND_MULTIPLE" } }],
                category: [{ $: { "android:name": "android.intent.category.DEFAULT" } }],
                data: [{ $: { "android:mimeType": "*/*" } }],
            },
        ]

        mainActivity["intent-filter"] = [
            ...(mainActivity["intent-filter"] ?? []),
            ...intentFilters,
        ]

        return config
    })
}

function withShareMenuIosEntitlements(config) {
    return withEntitlementsPlist(config, (config) => {
        const bundleIdentifier = getBundleIdentifier(config)
        const appGroup = getAppGroup(bundleIdentifier)
        const groups = new Set(config.modResults["com.apple.security.application-groups"] ?? [])

        groups.add(appGroup)
        config.modResults["com.apple.security.application-groups"] = Array.from(groups)

        return config
    })
}

function withShareMenuIosBridgingHeader(config) {
    return withDangerousMod(config, [
        "ios",
        async (config) => {
            const projectRoot = config.modRequest.projectRoot
            const platformProjectRoot = config.modRequest.platformProjectRoot
            const appName = config.modRequest.projectName
            const bridgingHeaderPath = path.join(
                platformProjectRoot,
                appName,
                `${appName}-Bridging-Header.h`,
            )

            if (!fs.existsSync(bridgingHeaderPath)) {
                return config
            }

            let contents = fs.readFileSync(bridgingHeaderPath, "utf8")
            const importLine = "#import <RNShareMenu/ShareMenuManager.h>"

            if (!contents.includes(importLine)) {
                contents = `${contents.trimEnd()}\n${importLine}\n`
                fs.writeFileSync(bridgingHeaderPath, contents)
            }

            return config
        },
    ])
}

function withShareMenuIosAppDelegate(config) {
    return withAppDelegate(config, (config) => {
        if (config.modResults.language !== "swift") {
            throw new Error(
                `[${TAG}] Swift AppDelegate is required for react-native-share-menu.`,
            )
        }

        let contents = config.modResults.contents

        contents = mergeContents({
            tag: `${TAG}-open-url`,
            src: contents,
            newSrc: [
                "_ = ShareMenuManager.application(app, open: url, options: options)",
            ].join("\n"),
            anchor:
                /return super\.application\(app, open: url, options: options\) \|\| RCTLinkingManager\.application\(app, open: url, options: options\)/,
            offset: 0,
            comment: "//",
        }).contents

        config.modResults.contents = contents
        return config
    })
}

function withShareMenuIosPodfile(config) {
    return withPodfile(config, (config) => {
        const extensionTarget = `
target '${EXTENSION_NAME}' do
  inherit! :search_paths
  pod 'RNShareMenu', :path => '../node_modules/react-native-share-menu'
end
`

        if (config.modResults.contents.includes(`target '${EXTENSION_NAME}'`)) {
            return config
        }

        config.modResults.contents += extensionTarget

        if (!config.modResults.contents.includes("APPLICATION_EXTENSION_API_ONLY")) {
            config.modResults.contents = mergeContents({
                tag: `${TAG}-podfile-post-install`,
                src: config.modResults.contents,
                newSrc: [
                    "    installer.pods_project.targets.each do |target|",
                    "      target.build_configurations.each do |build_config|",
                    "        build_config.build_settings['APPLICATION_EXTENSION_API_ONLY'] = 'NO'",
                    "      end",
                    "    end",
                ].join("\n"),
                anchor: /post_install do \|installer\|/,
                offset: 1,
                comment: "#",
            }).contents
        }

        return config
    })
}

function getShareExtensionInfoPlist(appName, bundleIdentifier, urlScheme) {
    return {
        CFBundleName: "$(PRODUCT_NAME)",
        CFBundleDisplayName: `${appName} Share`,
        CFBundleIdentifier: "$(PRODUCT_BUNDLE_IDENTIFIER)",
        CFBundleDevelopmentRegion: "$(DEVELOPMENT_LANGUAGE)",
        CFBundleExecutable: "$(EXECUTABLE_NAME)",
        CFBundleInfoDictionaryVersion: "6.0",
        CFBundlePackageType: "$(PRODUCT_BUNDLE_PACKAGE_TYPE)",
        HostAppBundleIdentifier: bundleIdentifier,
        HostAppURLScheme: `${urlScheme}://`,
        NSExtension: {
            NSExtensionAttributes: {
                NSExtensionActivationRule: "TRUEPREDICATE",
            },
            NSExtensionPrincipalClass: "$(PRODUCT_MODULE_NAME).ShareViewController",
            NSExtensionPointIdentifier: "com.apple.share-services",
        },
    }
}

function writeShareExtensionFiles(platformProjectRoot, config) {
    const bundleIdentifier = getBundleIdentifier(config)
    const appGroup = getAppGroup(bundleIdentifier)
    const urlScheme = getUrlScheme(config)
    const extensionRoot = path.join(platformProjectRoot, EXTENSION_NAME)

    fs.mkdirSync(extensionRoot, { recursive: true })

    const shareViewControllerSource = path.join(
        config.modRequest.projectRoot,
        "node_modules/react-native-share-menu/ios/ShareViewController.swift",
    )

    fs.copyFileSync(
        shareViewControllerSource,
        path.join(extensionRoot, "ShareViewController.swift"),
    )

    fs.writeFileSync(
        path.join(extensionRoot, "ShareExtension.entitlements"),
        buildPlist({
            "com.apple.security.application-groups": [appGroup],
        }),
    )

    fs.writeFileSync(
        path.join(extensionRoot, "ShareExtension-Info.plist"),
        buildPlist(getShareExtensionInfoPlist(config.name ?? "Uet APP", bundleIdentifier, urlScheme)),
    )
}

function withShareMenuIosExtensionTarget(config) {
    return withXcodeProject(config, (config) => {
        const bundleIdentifier = getBundleIdentifier(config)
        const platformProjectRoot = config.modRequest.platformProjectRoot
        const pbxProject = config.modResults
        const extensionBundleId = `${bundleIdentifier}.${EXTENSION_NAME}`

        writeShareExtensionFiles(platformProjectRoot, config)

        if (pbxProject.pbxTargetByName(EXTENSION_NAME)) {
            return config
        }

        const sourceFiles = ["ShareViewController.swift"]
        const configFiles = ["ShareExtension-Info.plist", "ShareExtension.entitlements"]
        const allFiles = [...sourceFiles, ...configFiles]

        const extGroup = pbxProject.addPbxGroup(allFiles, EXTENSION_NAME, EXTENSION_NAME)
        const groups = pbxProject.hash.project.objects.PBXGroup

        Object.keys(groups).forEach((key) => {
            if (
                typeof groups[key] === "object" &&
                groups[key].name === undefined &&
                groups[key].path === undefined
            ) {
                pbxProject.addToPbxGroup(extGroup.uuid, key)
            }
        })

        const projObjects = pbxProject.hash.project.objects
        projObjects.PBXTargetDependency = projObjects.PBXTargetDependency || {}
        projObjects.PBXContainerItemProxy = projObjects.PBXContainerItemProxy || {}

        const target = pbxProject.addTarget(EXTENSION_NAME, "app_extension", EXTENSION_NAME)

        pbxProject.addBuildPhase(sourceFiles, "PBXSourcesBuildPhase", "Sources", target.uuid)
        pbxProject.addBuildPhase([], "PBXResourcesBuildPhase", "Resources", target.uuid)
        pbxProject.addBuildPhase([], "PBXFrameworksBuildPhase", "Frameworks", target.uuid)

        const configurations = pbxProject.pbxXCBuildConfigurationSection()
        Object.keys(configurations).forEach((key) => {
            const buildSettings = configurations[key].buildSettings
            if (!buildSettings?.PRODUCT_NAME) {
                return
            }

            const productName = String(buildSettings.PRODUCT_NAME).replace(/"/g, "")

            if (productName !== EXTENSION_NAME) {
                return
            }

            buildSettings.CLANG_ENABLE_MODULES = "YES"
            buildSettings.INFOPLIST_FILE = `"${EXTENSION_NAME}/ShareExtension-Info.plist"`
            buildSettings.CODE_SIGN_ENTITLEMENTS = `"${EXTENSION_NAME}/ShareExtension.entitlements"`
            buildSettings.CODE_SIGN_STYLE = "Automatic"
            buildSettings.GENERATE_INFOPLIST_FILE = "YES"
            buildSettings.PRODUCT_BUNDLE_IDENTIFIER = `"${extensionBundleId}"`
            buildSettings.SWIFT_VERSION = "5.0"
            buildSettings.TARGETED_DEVICE_FAMILY = `"1,2"`
            buildSettings.IPHONEOS_DEPLOYMENT_TARGET =
                buildSettings.IPHONEOS_DEPLOYMENT_TARGET ?? "15.1"
        })

        return config
    })
}

function withReactNativeShareMenu(config) {
    config = withShareMenuPackagePatches(config)
    config = withShareMenuAndroid(config)
    config = withShareMenuIosEntitlements(config)
    config = withShareMenuIosBridgingHeader(config)
    config = withShareMenuIosAppDelegate(config)
    config = withShareMenuIosPodfile(config)
    config = withShareMenuIosExtensionTarget(config)
    return config
}

module.exports = withReactNativeShareMenu
