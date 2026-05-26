import ApiService from "@/lib/network"

export type Student = {
    id: string
    fullname?: string
    id_number?: string
    image?: string
    email?: string
    study_program?: string
    study_year?: string
}

export interface StudentsResponse {
    students: Student[]
}

export async function getStudents(params: Record<string, unknown>) {
    return ApiService.fetchData<StudentsResponse>({
        url: "/contracts/scandocuments/folders/device/students",
        method: "get",
        params,
    })
}