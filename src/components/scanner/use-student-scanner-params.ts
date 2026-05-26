import { useGlobalSearchParams, useLocalSearchParams } from "expo-router"

import { getRouteParam } from "@/components/scan-documents/student-tab-shell"

type StudentRouteParams = {
    folder_id?: string | string[]
    student_id?: string | string[]
    folder_name?: string | string[]
    student_name?: string | string[]
}

function mergeRouteParams(
    global: StudentRouteParams,
    local: StudentRouteParams
): StudentRouteParams {
    return {
        folder_id: global.folder_id ?? local.folder_id,
        student_id: global.student_id ?? local.student_id,
        folder_name: global.folder_name ?? local.folder_name,
        student_name: global.student_name ?? local.student_name,
    }
}

/** Parent dynamic segments ([folder_id], [student_id]) live in global params inside tab screens. */
export function useStudentScannerParams() {
    const globalParams = useGlobalSearchParams<StudentRouteParams>()
    const localParams = useLocalSearchParams<StudentRouteParams>()
    const params = mergeRouteParams(globalParams, localParams)

    const student_id = getRouteParam(params.student_id) ?? ""
    const folderId = getRouteParam(params.folder_id) ?? ""
    const studentName = getRouteParam(params.student_name) ?? "Student"
    const folderName = getRouteParam(params.folder_name) ?? "Folder"

    return { student_id, folderId, studentName, folderName, params }
}
