
import { StudentTabShell } from "@/components/scan-documents/student-tab-shell"
import CamscanOption1Screen from "@/components/scanner/option1"
import { useStudentScannerParams } from "@/components/scanner/use-student-scanner-params"
import { useCamscanStore } from "@/store/camscan-store"
import { useEffect } from "react"

export default function StudentScanNowScreen() {
    const { student_id, studentName } = useStudentScannerParams()
    const title = studentName
    const createItemFromScan = useCamscanStore((s) => s.createItemFromScan)
    useEffect(() => {
        createItemFromScan([], title, student_id)
    }, [createItemFromScan, title, student_id])

    return (
        <StudentTabShell title={title}>
           <CamscanOption1Screen student_id={student_id}/>
        </StudentTabShell>
    )
}
