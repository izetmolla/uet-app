import { type Href, useLocalSearchParams, useRouter } from "expo-router"
import { useCallback } from "react"

import { StudentPhotosGallery } from "@/components/scan-documents/student-photos-gallery"
import { getRouteParam } from "@/components/scan-documents/student-tab-shell"
import { Box } from "@/components/ui/box"

const StudentDocumentsScreen = () => {
    const router = useRouter()
    const { folder_id, student_id, student_name } = useLocalSearchParams<{
        folder_id: string
        student_id: string
        student_name?: string | string[]
    }>()

    const studentId = getRouteParam(student_id) ?? ""

    const openCamera = useCallback(() => {
        router.push({
            pathname: "/scan-documents/students/camera",
            params: {
                folder_id: getRouteParam(folder_id),
                student_id: studentId,
                student_name: getRouteParam(student_name),
            },
        } as Href)
    }, [folder_id, router, studentId, student_name])

    return (
        <Box className="flex-1 bg-background-50">
            <StudentPhotosGallery
                studentId={studentId}
                folderId={getRouteParam(folder_id)}
                onScanPress={openCamera}
            />
        </Box>
    )
}

export default StudentDocumentsScreen
