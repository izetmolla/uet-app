import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { ScannerOptionId } from "@/types/student-scanner"

type ScannerSettingsState = {
    selectedOption: ScannerOptionId
    setSelectedOption: (option: ScannerOptionId) => void
}

export const useScannerSettingsStore = create<ScannerSettingsState>()(
    persist(
        (set) => ({
            selectedOption: "2",
            setSelectedOption: (option) => set({ selectedOption: option }),
        }),
        {
            name: "scanner-settings",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)
