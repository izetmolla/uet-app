import axios from "axios"

import { uploadContractPhoto } from "@/api/protected/contracts/upload"
import { generateCollectionPdf } from "@/lib/camscan/generate-collection-pdf"
import { createId } from "@/lib/camscan/storage"
import { getRequestErrorMessage } from "@/lib/network/errors"
import {
    getOrderedStudentPhotos,
    sortPhotosByCreatedAt,
} from "@/lib/scan-documents/ordered-photos"
import { pdfUriToUploadFile } from "@/lib/scan-documents/pdf-uri-to-upload-file"
import { persistStudentPdf } from "@/lib/scan-documents/storage"
import { usePdfUploadStore } from "@/store/pdf-upload"
import { useStudentPdfsStore } from "@/store/student-pdfs"
import type { ScanDocumentsPhoto } from "@/types/scan-documents"

const UPLOAD_FAILED_MESSAGE = "Could not upload this PDF."
const GENERATION_FAILED_MESSAGE = "Could not generate the PDF."

type PdfUploadJob = {
    studentId: string
    folderId?: string
    pdfId: string
    cancelled: boolean
    controller: AbortController | null
}

const activeJobs = new Map<string, PdfUploadJob>()

function isUploadCancelled(error: unknown) {
    if (!axios.isAxiosError(error)) return false
    return error.code === "ERR_CANCELED" || error.name === "CanceledError"
}

function getUploadStore() {
    return usePdfUploadStore.getState()
}

function getPdfsStore() {
    return useStudentPdfsStore.getState()
}

export function isPdfUploadActive(studentId: string) {
    const job = activeJobs.get(studentId)
    return Boolean(job && !job.cancelled)
}

export function cancelPdfUpload(studentId: string) {
    const job = activeJobs.get(studentId)
    if (!job) return

    job.cancelled = true
    job.controller?.abort()
    job.controller = null
    activeJobs.delete(studentId)
    getUploadStore().clearUploadSession(studentId)
}

export function dismissPdfUploadSession(studentId: string) {
    if (isPdfUploadActive(studentId)) {
        cancelPdfUpload(studentId)
        return
    }

    getUploadStore().clearUploadSession(studentId)
}

export function startPdfUploadFromPhotos(options: {
    studentId: string
    folderId?: string
    photos: ScanDocumentsPhoto[]
    title: string
}) {
    const { studentId, folderId, title, photos: photosFromCaller } = options
    const fromStore = getOrderedStudentPhotos(studentId)
    const photos =
        fromStore.length > 0
            ? fromStore
            : sortPhotosByCreatedAt(photosFromCaller ?? [])

    if (photos.length === 0) return false

    cancelPdfUpload(studentId)

    const pdfId = createId()
    const job: PdfUploadJob = {
        studentId,
        folderId,
        pdfId,
        cancelled: false,
        controller: null,
    }
    activeJobs.set(studentId, job)

    const uploadStore = getUploadStore()
    uploadStore.initPdfUpload(studentId, pdfId)

    void runPdfUpload(job, photos, title)

    return true
}

export function retryPdfUpload(options: {
    studentId: string
    folderId?: string
    pdfId: string
    uri: string
    title: string
}) {
    const { studentId, folderId, pdfId, uri, title } = options

    cancelPdfUpload(studentId)

    const job: PdfUploadJob = {
        studentId,
        folderId,
        pdfId,
        cancelled: false,
        controller: null,
    }
    activeJobs.set(studentId, job)

    const uploadStore = getUploadStore()
    uploadStore.initPdfUpload(studentId, pdfId)
    uploadStore.setPdfProgress(studentId, pdfId, 20, "uploading")

    void uploadPersistedPdf(job, uri, title)

    return true
}

async function runPdfUpload(
    job: PdfUploadJob,
    photos: ScanDocumentsPhoto[],
    title: string
) {
    const uploadStore = getUploadStore()

    try {
        uploadStore.setPdfProgress(job.studentId, job.pdfId, 5, "generating")

        const { uri: tempUri, pageCount } = await generateCollectionPdf(
            photos,
            title
        )

        if (job.cancelled) return

        uploadStore.setPdfProgress(job.studentId, job.pdfId, 15, "generating")

        const persistedUri = await persistStudentPdf(
            job.studentId,
            tempUri,
            job.pdfId
        )

        if (job.cancelled) return

        const now = new Date().toISOString()
        getPdfsStore().addPdf(job.studentId, {
            id: job.pdfId,
            title,
            uri: persistedUri,
            pageCount,
            createdAt: now,
        })

        uploadStore.setPdfProgress(job.studentId, job.pdfId, 20, "uploading")

        await uploadPersistedPdf(job, persistedUri, title)
    } catch (error) {
        if (job.cancelled || isUploadCancelled(error)) {
            uploadStore.clearPdfStatus(job.studentId, job.pdfId)
            return
        }

        uploadStore.setPdfError(
            job.studentId,
            job.pdfId,
            getRequestErrorMessage(error, GENERATION_FAILED_MESSAGE)
        )
    } finally {
        if (!job.cancelled) {
            activeJobs.delete(job.studentId)
        }
    }
}

async function uploadPersistedPdf(
    job: PdfUploadJob,
    uri: string,
    _title: string
) {
    const uploadStore = getUploadStore()

    uploadStore.setPdfUploading(job.studentId, job.pdfId, "uploading")

    const controller = new AbortController()
    job.controller = controller

    try {
        await uploadContractPhoto(pdfUriToUploadFile(uri, job.pdfId), {
            signal: controller.signal,
            body: {
                student_id: job.studentId,
                folder_id: job.folderId,
                pdf_id: job.pdfId,
                document_type: "pdf",
            },
            onUploadProgress: (event) => {
                if (job.cancelled) return

                const total = event.total ?? 0
                const loaded = event.loaded ?? 0
                const uploadPercent =
                    total > 0 ? Math.round((loaded / total) * 100) : 0
                const overallPercent = 20 + Math.round((uploadPercent * 80) / 100)

                uploadStore.setPdfProgress(
                    job.studentId,
                    job.pdfId,
                    overallPercent,
                    "uploading"
                )
            },
        })

        if (job.cancelled) return

        uploadStore.setPdfSuccess(job.studentId, job.pdfId)
    } catch (error) {
        if (job.cancelled || isUploadCancelled(error)) {
            uploadStore.clearPdfStatus(job.studentId, job.pdfId)
            return
        }

        uploadStore.setPdfError(
            job.studentId,
            job.pdfId,
            getRequestErrorMessage(error, UPLOAD_FAILED_MESSAGE)
        )
    } finally {
        job.controller = null
    }
}
