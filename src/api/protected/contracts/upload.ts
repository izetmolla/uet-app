import type { AxiosProgressEvent } from "axios"

import ApiService, { type UploadFile } from "@/lib/network"
import { getApiErrorMessageFromBody, isApiErrorBody } from "@/lib/network/errors"

const UPLOAD_PATH = "/contracts/scandocuments/documents/upload"

export type ContractUploadBody = {
    student_id?: string
    folder_id?: string
    photo_id?: string
    pdf_id?: string
    document_type?: "photo" | "pdf"
}

export type UploadContractPhotoOptions = {
    body?: ContractUploadBody
    signal?: AbortSignal
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
}

export async function uploadContractPhoto(
    file: UploadFile,
    options?: UploadContractPhotoOptions
) {
    const data = await ApiService.uploadFileData<unknown, ContractUploadBody>(
        UPLOAD_PATH,
        file,
        {
            body: options?.body,
            signal: options?.signal,
            onUploadProgress: options?.onUploadProgress,
        }
    )

    if (isApiErrorBody(data)) {
        throw new Error(
            getApiErrorMessageFromBody(data, "Could not upload this photo.")
        )
    }

    return data
}
