import {
    copyAsync,
    deleteAsync,
    documentDirectory,
    getInfoAsync,
    makeDirectoryAsync,
} from "expo-file-system/legacy"

const CAMSCAN_ROOT = `${documentDirectory}camscan/`

export function createId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

async function ensureDir(path: string) {
    const info = await getInfoAsync(path)
    if (!info.exists) {
        await makeDirectoryAsync(path, { intermediates: true })
    }
}

export async function persistScannedImages(
    itemId: string,
    sourceUris: string[]
): Promise<string[]> {
    const itemDir = `${CAMSCAN_ROOT}${itemId}/`
    await ensureDir(itemDir)

    const persisted: string[] = []

    for (const sourceUri of sourceUris) {
        const photoId = createId()
        const dest = `${itemDir}${photoId}.jpg`
        await copyAsync({ from: sourceUri, to: dest })
        persisted.push(dest)
    }

    return persisted
}

export async function persistSingleScan(
    itemId: string,
    sourceUri: string
): Promise<string> {
    const [uri] = await persistScannedImages(itemId, [sourceUri])
    return uri
}

export async function deleteItemFiles(itemId: string) {
    const itemDir = `${CAMSCAN_ROOT}${itemId}/`
    const info = await getInfoAsync(itemDir)
    if (info.exists) {
        await deleteAsync(itemDir, { idempotent: true })
    }
}

export async function deletePhotoFile(uri: string) {
    const info = await getInfoAsync(uri)
    if (info.exists) {
        await deleteAsync(uri, { idempotent: true })
    }
}
