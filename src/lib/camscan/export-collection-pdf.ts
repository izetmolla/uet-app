import * as Sharing from "expo-sharing"

import { generateCollectionPdf } from "@/lib/camscan/generate-collection-pdf"
import type { CamscanPhoto } from "@/types/camscan"

export async function exportCollectionToPdf(
    photos: CamscanPhoto[],
    title: string
) {
    const { uri: pdfUri } = await generateCollectionPdf(photos, title)

    const canShare = await Sharing.isAvailableAsync()
    if (!canShare) {
        throw new Error("Sharing is not available on this device")
    }

    await Sharing.shareAsync(pdfUri, {
        UTI: "com.adobe.pdf",
        mimeType: "application/pdf",
        dialogTitle: `Share ${title}`,
    })
}
