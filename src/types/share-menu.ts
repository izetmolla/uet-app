export type SharedFileItem = {
    mimeType: string
    data: string
}

export type SharedPayload = {
    items: SharedFileItem[]
    extraData?: Record<string, unknown> | null
}
