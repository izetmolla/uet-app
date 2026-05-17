import Constants from "expo-constants"
import { Alert, NativeModules, Platform, PermissionsAndroid } from "react-native"

async function ensureAndroidCameraPermission() {
    if (Platform.OS !== "android") return true

    const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
    )

    return result === PermissionsAndroid.RESULTS.GRANTED
}

function isExpoGo() {
    return Constants.executionEnvironment === "storeClient"
}

function hasNativeScannerModule() {
    return Boolean(
        (NativeModules as Record<string, unknown>).DocumentScanner
    )
}

async function loadDocumentScanner() {
    if (Platform.OS === "web") {
        return null
    }

    if (!hasNativeScannerModule()) {
        return null
    }

    try {
        return await import("react-native-document-scanner-plugin")
    } catch {
        return null
    }
}

function showScannerUnavailableAlert() {
    const message = isExpoGo()
        ? "Document scanning is not available in Expo Go. Create a development build with:\n\nnpx expo prebuild\nnpx expo run:android"
        : "The document scanner native module is missing. Rebuild the app after installing react-native-document-scanner-plugin:\n\nnpx expo prebuild\nnpx expo run:android"

    Alert.alert("Scanner unavailable", message)
}

export function isDocumentScannerAvailable() {
    if (Platform.OS === "web") return false
    return hasNativeScannerModule()
}

export async function scanDocuments(maxNumDocuments?: number) {
    if (Platform.OS === "web") {
        Alert.alert(
            "Not available",
            "Document scanning is only available on iOS and Android devices."
        )
        return []
    }

    const scanner = await loadDocumentScanner()
    if (!scanner) {
        showScannerUnavailableAlert()
        return []
    }

    const hasPermission = await ensureAndroidCameraPermission()
    if (!hasPermission) {
        Alert.alert(
            "Camera required",
            "Allow camera access to scan documents."
        )
        return []
    }

    const response = await scanner.default.scanDocument({
        croppedImageQuality: 90,
        maxNumDocuments,
    })

    if (
        response.status === scanner.ScanDocumentResponseStatus.Cancel ||
        !response.scannedImages?.length
    ) {
        return []
    }

    return response.scannedImages
}
