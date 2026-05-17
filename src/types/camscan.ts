export type CamscanPhoto = {
    id: string
    uri: string
    createdAt: string
}

export type CamscanItem = {
    id: string
    title: string
    photos: CamscanPhoto[]
    createdAt: string
    updatedAt: string
}
