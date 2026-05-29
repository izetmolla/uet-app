import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { ScanDocumentsPdf } from "@/types/scan-documents"

export const EMPTY_STUDENT_PDFS: ScanDocumentsPdf[] = []

type StudentPdfsState = {
    byStudent: Record<string, ScanDocumentsPdf[]>
    addPdf: (studentId: string, pdf: ScanDocumentsPdf) => void
    removePdf: (studentId: string, pdfId: string) => void
    getPdfs: (studentId: string) => ScanDocumentsPdf[]
}

export const useStudentPdfsStore = create<StudentPdfsState>()(
    persist(
        (set, get) => ({
            byStudent: {},
            addPdf: (studentId, pdf) => {
                set((state) => {
                    const existing = state.byStudent[studentId] ?? []
                    const withoutDuplicate = existing.filter(
                        (item) => item.id !== pdf.id
                    )

                    return {
                        byStudent: {
                            ...state.byStudent,
                            [studentId]: [pdf, ...withoutDuplicate],
                        },
                    }
                })
            },
            removePdf: (studentId, pdfId) => {
                set((state) => ({
                    byStudent: {
                        ...state.byStudent,
                        [studentId]: (state.byStudent[studentId] ?? []).filter(
                            (pdf) => pdf.id !== pdfId
                        ),
                    },
                }))
            },
            getPdfs: (studentId) => get().byStudent[studentId] ?? [],
        }),
        {
            name: "student-pdfs-storage",
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ byStudent: state.byStudent }),
        }
    )
)
