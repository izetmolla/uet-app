import type { UploadFile } from "@/lib/network"

export function photoUriToUploadFile(uri: string, photoId: string): UploadFile {
    const extension =
        uri.split(".").pop()?.split("?")[0]?.toLowerCase() ?? "jpg"
    const isPng = extension === "png"

    return {
        uri,
        name: `scan-${photoId}.${isPng ? "png" : "jpg"}`,
        type: isPng ? "image/png" : "image/jpeg",
    }
}
