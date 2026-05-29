import { useLocalSearchParams } from "expo-router"

import { StudentPdfsList } from "@/components/scan-documents/student-pdfs-list"
import { getRouteParam } from "@/components/scan-documents/student-tab-shell"
import { Box } from "@/components/ui/box"

export default function StudentPdfsScreen() {
    const { folder_id, student_id, student_name } = useLocalSearchParams<{
        folder_id: string
        student_id: string
        student_name?: string | string[]
    }>()

    const studentId = getRouteParam(student_id) ?? ""
    const studentName = getRouteParam(student_name) ?? "Student"

    return (
        <Box className="flex-1 bg-background-50">
            <StudentPdfsList
                studentId={studentId}
                folderId={getRouteParam(folder_id)}
                studentName={studentName}
            />
        </Box>
    )
}
