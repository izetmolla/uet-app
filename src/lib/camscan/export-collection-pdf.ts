import * as Print from "expo-print"
import * as Sharing from "expo-sharing"
import { readAsStringAsync } from "expo-file-system/legacy"

import type { CamscanPhoto } from "@/types/camscan"

function escapeHtml(value: string) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
}

async function photoToDataUri(uri: string) {
    const base64 = await readAsStringAsync(uri, { encoding: "base64" })
    return `data:image/jpeg;base64,${base64}`
}

export async function exportCollectionToPdf(
    photos: CamscanPhoto[],
    title: string
) {
    if (photos.length === 0) {
        throw new Error("No pages to export")
    }

    const pagesHtml = await Promise.all(
        photos.map(async (photo, index) => {
            const dataUri = await photoToDataUri(photo.uri)
            const pageBreak =
                index < photos.length - 1 ? "page-break-after: always;" : ""
            return `<div style="${pageBreak}"><img src="${dataUri}" style="width:100%;height:auto;display:block;" /></div>`
        })
    )

    const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <style>
      body { margin: 0; padding: 0; }
      @page { margin: 24px; }
    </style>
  </head>
  <body>
    ${pagesHtml.join("")}
  </body>
</html>`

    const { uri: pdfUri } = await Print.printToFileAsync({ html })

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
