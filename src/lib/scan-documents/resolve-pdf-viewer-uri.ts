import { Platform } from "react-native"
import { getContentUriAsync } from "expo-file-system/legacy"

/** URI suitable for WebView / system viewer (content:// on Android). */
export async function resolvePdfViewerUri(fileUri: string): Promise<string> {
    if (Platform.OS === "android") {
        return getContentUriAsync(fileUri)
    }

    return fileUri
}
