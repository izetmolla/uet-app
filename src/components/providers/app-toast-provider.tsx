import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    type ReactNode,
} from "react"

import {
    Toast,
    ToastDescription,
    ToastTitle,
    useToast,
} from "@/components/ui/toast"

export type AppToastStatus = "error" | "info" | "warning" | "success"

export type AppToastOptions = {
    title: string
    description?: string
    duration?: number
}

type AppToastContextValue = {
    show: (status: AppToastStatus, options: AppToastOptions) => void
    showError: (options: AppToastOptions) => void
    showInfo: (options: AppToastOptions) => void
    showWarning: (options: AppToastOptions) => void
    showSuccess: (options: AppToastOptions) => void
}

const AppToastContext = createContext<AppToastContextValue | null>(null)

export function AppToastProvider({ children }: { children: ReactNode }) {
    const toast = useToast()

    const show = useCallback(
        (
            status: AppToastStatus,
            { title, description, duration = 4000 }: AppToastOptions
        ) => {
            toast.show({
                placement: "top",
                duration,
                render: ({ id }) => (
                    <Toast
                        nativeID={`toast-${id}`}
                        action={status}
                        variant="solid"
                    >
                        <ToastTitle>{title}</ToastTitle>
                        {description ? (
                            <ToastDescription>{description}</ToastDescription>
                        ) : null}
                    </Toast>
                ),
            })
        },
        [toast]
    )

    const value = useMemo<AppToastContextValue>(
        () => ({
            show,
            showError: (options) => show("error", options),
            showInfo: (options) => show("info", options),
            showWarning: (options) => show("warning", options),
            showSuccess: (options) => show("success", options),
        }),
        [show]
    )

    return (
        <AppToastContext.Provider value={value}>
            {children}
        </AppToastContext.Provider>
    )
}

export function useAppToast() {
    const context = useContext(AppToastContext)

    if (!context) {
        throw new Error("useAppToast must be used within AppToastProvider")
    }

    return context
}
