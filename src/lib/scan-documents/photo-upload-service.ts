import axios from "axios"

import { uploadContractPhoto } from "@/api/protected/contracts/upload"
import { getRequestErrorMessage } from "@/lib/network/errors"
import { photoUriToUploadFile } from "@/lib/scan-documents/photo-upload-file"
import { usePhotoUploadStore } from "@/store/photo-upload"
import type { ScanDocumentsPhoto } from "@/types/scan-documents"

const UPLOAD_FAILED_MESSAGE = "Could not upload this photo."

type UploadJob = {
    studentId: string
    folderId?: string
    cancelled: boolean
    controllers: Map<string, AbortController>
}

const activeJobs = new Map<string, UploadJob>()

function isUploadCancelled(error: unknown) {
    if (!axios.isAxiosError(error)) return false
    return error.code === "ERR_CANCELED" || error.name === "CanceledError"
}

function getStore() {
    return usePhotoUploadStore.getState()
}

async function uploadSinglePhoto(
    photo: ScanDocumentsPhoto,
    job: UploadJob
) {
    if (job.cancelled) return

    const {
        setPhotoUploading,
        setPhotoProgress,
        setPhotoSuccess,
        setPhotoError,
        clearPhotoStatus,
    } = getStore()

    setPhotoUploading(job.studentId, photo.id)
    setPhotoProgress(job.studentId, photo.id, 0)

    const controller = new AbortController()
    job.controllers.set(photo.id, controller)

    try {
        await uploadContractPhoto(photoUriToUploadFile(photo.uri, photo.id), {
            signal: controller.signal,
            body: {
                student_id: job.studentId,
                folder_id: job.folderId,
                photo_id: photo.id,
            },
            onUploadProgress: (event) => {
                if (job.cancelled) return

                const total = event.total ?? 0
                const loaded = event.loaded ?? 0
                const progress =
                    total > 0 ? Math.round((loaded / total) * 100) : 0

                setPhotoProgress(job.studentId, photo.id, progress)
            },
        })

        if (job.cancelled) return

        setPhotoSuccess(job.studentId, photo.id)
    } catch (error) {
        if (job.cancelled || isUploadCancelled(error)) {
            clearPhotoStatus(job.studentId, photo.id)
            return
        }

        setPhotoError(
            job.studentId,
            photo.id,
            getRequestErrorMessage(error, UPLOAD_FAILED_MESSAGE)
        )
    } finally {
        job.controllers.delete(photo.id)
    }
}

function finishJobIfIdle(job: UploadJob) {
    if (job.controllers.size > 0) return

    activeJobs.delete(job.studentId)
}

async function runUploadBatch(
    studentId: string,
    folderId: string | undefined,
    photos: ScanDocumentsPhoto[]
) {
    const job = activeJobs.get(studentId)
    if (!job || job.cancelled) return

    await Promise.all(
        photos.map(async (photo) => {
            await uploadSinglePhoto(photo, job)
            finishJobIfIdle(job)
        })
    )

    finishJobIfIdle(job)
}

export function startPhotoUploadBatch(options: {
    studentId: string
    folderId?: string
    photos: ScanDocumentsPhoto[]
}) {
    const { studentId, folderId, photos } = options

    if (photos.length === 0) return false

    cancelPhotoUploadBatch(studentId, { silent: true })

    const job: UploadJob = {
        studentId,
        folderId,
        cancelled: false,
        controllers: new Map(),
    }
    activeJobs.set(studentId, job)

    const store = getStore()
    store.setBatchMeta(studentId, photos.length)
    store.initUploadSession(
        studentId,
        photos.map((photo) => photo.id)
    )

    void runUploadBatch(studentId, folderId, photos)

    return true
}

export function cancelPhotoUploadBatch(
    studentId: string,
    options?: { silent?: boolean }
) {
    const job = activeJobs.get(studentId)
    if (!job) return

    job.cancelled = true

    for (const controller of job.controllers.values()) {
        controller.abort()
    }

    job.controllers.clear()
    activeJobs.delete(studentId)

    getStore().clearUploadingPhotos(studentId)
    getStore().clearBatchMeta(studentId)
}

export function dismissPhotoUploadSession(studentId: string) {
    const job = activeJobs.get(studentId)
    if (job && !job.cancelled) {
        cancelPhotoUploadBatch(studentId, { silent: true })
    }

    getStore().clearUploadSession(studentId)
}

export function retryAllFailedPhotoUploads(options: {
    studentId: string
    folderId?: string
    photos: ScanDocumentsPhoto[]
}) {
    const { studentId, folderId, photos } = options
    const session = getStore().sessions[studentId] ?? {}
    const failedPhotos = photos.filter(
        (photo) => session[photo.id]?.status === "error"
    )

    if (failedPhotos.length === 0) return false

    return startPhotoUploadBatch({
        studentId,
        folderId,
        photos: failedPhotos,
    })
}

export function retryPhotoUpload(options: {
    studentId: string
    folderId?: string
    photo: ScanDocumentsPhoto
}) {
    const { studentId, folderId, photo } = options

    let job = activeJobs.get(studentId)

    if (!job || job.cancelled) {
        job = {
            studentId,
            folderId,
            cancelled: false,
            controllers: new Map(),
        }
        activeJobs.set(studentId, job)
        getStore().setBatchMeta(studentId, 1)
    }

    void (async () => {
        await uploadSinglePhoto(photo, job!)
        finishJobIfIdle(job!)
    })()
}

export function isPhotoUploadBatchActive(studentId: string) {
    const job = activeJobs.get(studentId)
    return Boolean(job && !job.cancelled)
}
