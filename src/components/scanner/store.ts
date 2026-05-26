import { create } from "zustand";

type ScannerStore = {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}
const useScannerStore = create<ScannerStore>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen }),
}))

export default useScannerStore