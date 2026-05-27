import { useLocalSearchParams } from "expo-router"

import { ScanDocumentsCameraSessionProvider } from "@/components/scan-documents/camera/camera-session-context"
import ScanDocumentsCameraFooter from "@/components/scan-documents/camera/footer"
import ScanDocumentsCameraHeader from "@/components/scan-documents/camera/header"
import ScanDocumentsCameraPreview from "@/components/scan-documents/camera/preview"
import { getRouteParam } from "@/components/scan-documents/student-tab-shell"
import { Box } from "@/components/ui/box"
import { useDisableDrawerSwipe } from "@/hooks/use-disable-drawer-swipe"
import { SafeAreaView } from "react-native-safe-area-context"

const ScanDocumentsCameraScreen = () => {
    useDisableDrawerSwipe()
    const { student_id, student_name } = useLocalSearchParams<{
        student_id?: string | string[]
        student_name?: string | string[]
    }>()

    const studentId = getRouteParam(student_id) ?? ""
    const studentName = getRouteParam(student_name)

    return (
        <ScanDocumentsCameraSessionProvider
            studentId={studentId}
            studentName={studentName}
        >
            <Box className="flex-1 bg-black">
                <SafeAreaView
                    edges={["top", "left", "right"]}
                    className="bg-black"
                >
                    <Box className="bg-black">
                        <ScanDocumentsCameraHeader />
                    </Box>
                </SafeAreaView>

                <Box className="flex-1 bg-black">
                    <ScanDocumentsCameraPreview />
                </Box>

                <SafeAreaView
                    edges={["bottom", "left", "right"]}
                    className="bg-black"
                >
                    <Box className="bg-black">
                        <ScanDocumentsCameraFooter />
                    </Box>
                </SafeAreaView>
            </Box>
        </ScanDocumentsCameraSessionProvider>
    )
}

export default ScanDocumentsCameraScreen
