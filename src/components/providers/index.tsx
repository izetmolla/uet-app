import { QueryClientProvider } from "@tanstack/react-query"

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider"
import { useColorMode } from "@/contexts/color-mode"
import { queryClient } from "@/lib/network/query-client"

import { AppToastProvider } from "./app-toast-provider"

function ProvidersInner({ children }: { children: React.ReactNode }) {
    const { colorMode } = useColorMode()

    return (
        <GluestackUIProvider mode={colorMode}>
            <AppToastProvider>{children}</AppToastProvider>
        </GluestackUIProvider>
    )
}

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ProvidersInner>{children}</ProvidersInner>
        </QueryClientProvider>
    )
}

export default Providers
