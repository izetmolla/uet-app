import { useLocalSearchParams, useRouter } from "expo-router"
import { useCallback, useMemo } from "react"

import { PdfPreview } from "@/components/scan-documents/pdf-preview"
import { getRouteParam } from "@/components/scan-documents/student-tab-shell"
import {
    EMPTY_STUDENT_PDFS,
    useStudentPdfsStore,
} from "@/store/student-pdfs"

export default function StudentPdfPreviewScreen() {
    const router = useRouter()
    const { student_id, pdf_id, pdf_title } = useLocalSearchParams<{
        student_id: string
        pdf_id: string
        pdf_title?: string | string[]
    }>()

    const studentId = getRouteParam(student_id) ?? ""
    const pdfId = getRouteParam(pdf_id) ?? ""

    const pdf = useStudentPdfsStore((s) =>
        (s.byStudent[studentId] ?? EMPTY_STUDENT_PDFS).find(
            (item) => item.id === pdfId
        )
    )

    const title = useMemo(() => {
        const fromRoute = getRouteParam(pdf_title)
        return fromRoute ?? pdf?.title ?? "PDF preview"
    }, [pdf?.title, pdf_title])

    const handleClose = useCallback(() => {
        router.back()
    }, [router])

    if (!pdf) {
        return null
    }

    return (
        <PdfPreview title={title} uri={pdf.uri} onClose={handleClose} />
    )
}
