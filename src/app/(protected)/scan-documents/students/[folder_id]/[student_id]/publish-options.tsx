import { useLocalSearchParams } from "expo-router"

import { PublishOptionsSheet } from "@/components/scan-documents/publish-options-sheet"
import { getRouteParam } from "@/components/scan-documents/student-tab-shell"
import { useScanDocumentsStore } from "@/store/scan-documents"

export default function StudentPublishOptionsScreen() {
    const { folder_id, student_id, student_name } = useLocalSearchParams<{
        folder_id: string
        student_id: string
        student_name?: string | string[]
    }>()

    const studentId = getRouteParam(student_id) ?? ""
    const folderId = getRouteParam(folder_id)
    const title = getRouteParam(student_name) ?? "Student"
    const photos =
        useScanDocumentsStore((s) => s.getItem(studentId)?.photos) ?? []

    return (
        <PublishOptionsSheet
            title={title}
            studentId={studentId}
            folderId={folderId}
            photos={photos}
        />
    )
}
