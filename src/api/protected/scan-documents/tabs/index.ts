import ApiService from "@/lib/network"

export type ScanDocumentFolder = {
    id: string
    name: string
}

export interface ScanDocumentsFoldersResponse {
    folders: ScanDocumentFolder[]
}

export async function getScanDocumentsTabs() {
    return ApiService.fetchData<ScanDocumentsFoldersResponse>({
        url: "/contracts/scandocuments/folders/device/folders-to-scan",
        method: "get",
    })
}