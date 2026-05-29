import {
    documentDirectory,
    readAsStringAsync,
    writeAsStringAsync,
} from "expo-file-system/legacy"
import * as Print from "expo-print"
import { PDFDocument } from "pdf-lib"

import {
    A4_CONTENT_HEIGHT_PX,
    A4_CONTENT_WIDTH_PX,
    A4_HEIGHT_PX,
    A4_MARGIN_PX,
    A4_WIDTH_PX,
} from "@/lib/camscan/pdf-page-a4"
import { sortPhotosByCreatedAt } from "@/lib/scan-documents/ordered-photos"
import type { CamscanPhoto } from "@/types/camscan"

function getImageMimeType(uri: string) {
    const extension = uri.split(".").pop()?.split("?")[0]?.toLowerCase()
    if (extension === "png") return "image/png"
    if (extension === "webp") return "image/webp"
    return "image/jpeg"
}

async function photoToDataUri(uri: string) {
    const base64 = await readAsStringAsync(uri, { encoding: "base64" })
    const mimeType = getImageMimeType(uri)
    return `data:${mimeType};base64,${base64}`
}

function buildSinglePageHtml(dataUri: string, pageNumber: number, total: number) {
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @page {
        size: A4 portrait;
        margin: ${A4_MARGIN_PX}px;
      }
      * {
        box-sizing: border-box;
      }
      html,
      body {
        margin: 0;
        padding: 0;
        width: ${A4_WIDTH_PX}px;
        height: ${A4_HEIGHT_PX}px;
      }
      .page {
        width: ${A4_CONTENT_WIDTH_PX}px;
        height: ${A4_CONTENT_HEIGHT_PX}px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      img {
        display: block;
        max-width: ${A4_CONTENT_WIDTH_PX}px;
        max-height: ${A4_CONTENT_HEIGHT_PX}px;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center center;
      }
    </style>
  </head>
  <body>
    <div class="page" aria-label="Page ${pageNumber} of ${total}">
      <img src="${dataUri}" alt="Page ${pageNumber}" />
    </div>
  </body>
</html>`
}

async function printSinglePhotoPage(
    photo: CamscanPhoto,
    pageNumber: number,
    total: number
) {
    const dataUri = await photoToDataUri(photo.uri)
    const html = buildSinglePageHtml(dataUri, pageNumber, total)

    return Print.printToFileAsync({
        html,
        width: A4_WIDTH_PX,
        height: A4_HEIGHT_PX,
    })
}

function base64ToUint8Array(base64: string) {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }
    return bytes
}

function uint8ArrayToBase64(bytes: Uint8Array) {
    let binary = ""
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
}

async function mergePdfFiles(tempPdfUris: string[], outputPath: string) {
    const mergedPdf = await PDFDocument.create()

    for (const uri of tempPdfUris) {
        const base64 = await readAsStringAsync(uri, { encoding: "base64" })
        const singleDoc = await PDFDocument.load(base64ToUint8Array(base64))
        const pages = await mergedPdf.copyPages(
            singleDoc,
            singleDoc.getPageIndices()
        )
        for (const page of pages) {
            mergedPdf.addPage(page)
        }
    }

    const mergedBytes = await mergedPdf.save()
    await writeAsStringAsync(outputPath, uint8ArrayToBase64(mergedBytes), {
        encoding: "base64",
    })
}

export async function generateCollectionPdf(
    photos: CamscanPhoto[],
    _title: string
): Promise<{ uri: string; pageCount: number }> {
    const orderedPhotos = sortPhotosByCreatedAt(photos)

    if (orderedPhotos.length === 0) {
        throw new Error("No pages to export")
    }

    const total = orderedPhotos.length
    const tempUris: string[] = []

    for (let index = 0; index < orderedPhotos.length; index++) {
        const result = await printSinglePhotoPage(
            orderedPhotos[index],
            index + 1,
            total
        )
        tempUris.push(result.uri)
    }

    if (tempUris.length === 1) {
        return { uri: tempUris[0], pageCount: 1 }
    }

    const outputPath = `${documentDirectory}scan-collection-${Date.now()}.pdf`
    await mergePdfFiles(tempUris, outputPath)

    return {
        uri: outputPath,
        pageCount: total,
    }
}
