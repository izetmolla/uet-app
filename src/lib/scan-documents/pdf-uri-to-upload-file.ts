import type { UploadFile } from "@/lib/network"

export function pdfUriToUploadFile(uri: string, pdfId: string): UploadFile {
    return {
        uri,
        name: `scan-${pdfId}.pdf`,
        type: "application/pdf",
    }
}
