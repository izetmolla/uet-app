/**
 * High-level convenience API on top of the configured `BaseService`.
 *
 * `ApiService` wraps the raw axios client with thin helpers shaped
 * around the patterns this codebase uses everywhere:
 *
 *   - `fetchData`        - call an endpoint and resolve to the JSON body
 *   - `fetchDataBody`    - alias of `fetchData`
 *   - `fetchDataResponse` - full AxiosResponse when headers/status matter
 *   - `uploadFileData`   - multipart upload helper with progress callbacks
 */

import type {
    AxiosError,
    AxiosProgressEvent,
    AxiosRequestConfig,
    AxiosResponse,
} from "axios"

import { BaseService } from "./client"

/**
 * Standard error envelope the backend returns either inline on a
 * 200 (`{ error: true, ... }`) or as the JSON body of a 4xx/5xx
 * response. Centralizing the shape makes toast/copy code reusable.
 */
export interface ResponseWithError {
    error?: boolean
    message?: string
    code?: string
    details?: {
        field?: string
    }
}

/** Paginated list response shape. */
export interface ResponseWithPagination<T> extends ResponseWithError {
    data: T[]
    pagination: {
        page: number
        limit: number
        pageCount: number
        total: number
        total_pages: number
    }
}

/** Web `File` or React Native `{ uri, name, type }` upload payload. */
export type UploadFile =
    | File
    | {
          uri: string
          name: string
          type: string
      }

const ApiService = {
    fetchData<Response = unknown, Request = Record<string, unknown>>(
        param: AxiosRequestConfig<Request>,
    ): Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            BaseService(param)
                .then((response: AxiosResponse<Response>) => {
                    resolve(response.data)
                })
                .catch((errors: AxiosError) => {
                    reject(errors)
                })
        })
    },

    /** Alias of `fetchData` — resolves to the JSON response body. */
    fetchDataBody<Response = unknown, Request = Record<string, unknown>>(
        param: AxiosRequestConfig<Request>,
    ): Promise<Response> {
        return this.fetchData<Response, Request>(param)
    },

    /** Full Axios response (headers, status, etc.). */
    fetchDataResponse<Response = unknown, Request = Record<string, unknown>>(
        param: AxiosRequestConfig<Request>,
    ): Promise<AxiosResponse<Response>> {
        return new Promise<AxiosResponse<Response>>((resolve, reject) => {
            BaseService(param)
                .then((response: AxiosResponse<Response>) => {
                    resolve(response)
                })
                .catch((errors: AxiosError) => {
                    reject(errors)
                })
        })
    },

    uploadFileData<Response = unknown, Request = Record<string, unknown>>(
        path: string,
        file: UploadFile,
        options?: {
            body?: Request
            onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
            onFinish?: (data: Response) => void
            onError?: (error: ResponseWithError) => void
        },
    ) {
        return new Promise<Response>(async (resolve, reject) => {
            try {
                const formData = new FormData()

                if ("uri" in file) {
                    formData.append("file", file as unknown as Blob)
                } else {
                    formData.append("file", file)
                }

                if (options?.body) {
                    formData.append("body", JSON.stringify(options.body))
                }

                const uploaded = await BaseService.post(path, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    ...(options?.onUploadProgress
                        ? { onUploadProgress: options.onUploadProgress }
                        : {}),
                })

                if (uploaded?.data?.error) {
                    options?.onError?.(uploaded.data.error)
                } else {
                    options?.onFinish?.(uploaded.data)
                }
                resolve(uploaded.data)
            } catch (error) {
                options?.onError?.({
                    message: (error as AxiosError).message,
                    error: true,
                    code: "UPLOAD_FAILED",
                    details: { field: "file" },
                })
                reject(error)
            }
        })
    },
}

export default ApiService
