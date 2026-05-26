import {
    copyAsync,
    deleteAsync,
    documentDirectory,
    getInfoAsync,
    makeDirectoryAsync,
} from "expo-file-system/legacy"

import { createId } from "@/lib/camscan/storage"

const STUDENT_SCANS_ROOT = `${documentDirectory}scan-documents/students/`

async function ensureDir(path: string) {
    const info = await getInfoAsync(path)
    if (!info.exists) {
        await makeDirectoryAsync(path, { intermediates: true })
    }
}

export async function persistStudentScanImages(
    studentId: string,
    sourceUris: string[]
): Promise<string[]> {
    const studentDir = `${STUDENT_SCANS_ROOT}${studentId}/`
    await ensureDir(studentDir)

    const persisted: string[] = []

    for (const sourceUri of sourceUris) {
        const photoId = createId()
        const dest = `${studentDir}${photoId}.jpg`
        await copyAsync({ from: sourceUri, to: dest })
        persisted.push(dest)
    }

    return persisted
}

export async function deleteStudentPhotoFile(uri: string) {
    const info = await getInfoAsync(uri)
    if (info.exists) {
        await deleteAsync(uri, { idempotent: true })
    }
}
