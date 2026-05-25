import { type FC, useMemo } from "react"

import { Box } from "@/components/ui/box"
import { Heading } from "@/components/ui/heading"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"

import { ContentLoaderBreadcrumb } from "./breadcrumb"
import type { BreadcrumbItem, ContentLoaderHeaderProps } from "./types"

const HOME_ITEM: BreadcrumbItem = { label: "Home", to: "/" }

function breadcrumbWithHome(
    breadcrumb: BreadcrumbItem[] | undefined
): BreadcrumbItem[] {
    if (!breadcrumb?.length) return breadcrumb ?? []
    const first = breadcrumb[0]
    if (
        first?.label === "Home" &&
        (first?.to === "/" || first?.to === undefined)
    ) {
        return breadcrumb
    }
    return [HOME_ITEM, ...breadcrumb]
}

function breadcrumbWithTitle(
    breadcrumb: BreadcrumbItem[] | undefined,
    title: string | undefined
): BreadcrumbItem[] {
    if (!title || !breadcrumb?.length) return breadcrumb ?? []
    const hasTitle = breadcrumb.some((item) => item.label === title)
    if (hasTitle) return breadcrumb
    return [...breadcrumb, { label: title }]
}

/**
 * Page header with optional title, description, breadcrumb trail, and right-side actions.
 */
export const ContentLoaderHeader: FC<ContentLoaderHeaderProps> = ({
    title,
    description,
    breadcrumb,
    rightComponent,
    customTitle,
    error,
    forMeta,
    showHeaderSeparator = false,
    headerSeparatorMarginY = "mb-6",
    headerClassName,
}) => {
    const breadcrumbWithCurrent = useMemo(() => {
        const withHome = breadcrumbWithHome(breadcrumb)
        return breadcrumbWithTitle(withHome, title)
    }, [breadcrumb, title])

    if (forMeta) return null

    const showHeader = Boolean(
        title ??
            description ??
            rightComponent ??
            breadcrumbWithCurrent.length > 0
    )
    if (!showHeader) return null

    const separatorClasses = showHeaderSeparator
        ? `border-b border-outline-200 pb-1 ${headerSeparatorMarginY}`
        : "mb-2"

    return (
        <HStack
            className={`flex-wrap items-start justify-between gap-y-2 ${separatorClasses} ${headerClassName ?? ""}`}
        >
            <VStack space="xs" className="min-w-0 flex-1">
                {customTitle && !error ? (
                    customTitle
                ) : title ? (
                    <Heading size="xl" className="text-typography-900">
                        {title}
                    </Heading>
                ) : null}
                {description ? (
                    <Text size="sm" className="text-typography-500">
                        {description}
                    </Text>
                ) : null}
                {breadcrumbWithCurrent.length > 0 ? (
                    <ContentLoaderBreadcrumb
                        breadcrumb={breadcrumbWithCurrent}
                    />
                ) : null}
            </VStack>
            {rightComponent ? (
                <Box className="min-w-0 flex-1 basis-full justify-end sm:basis-auto">
                    {rightComponent}
                </Box>
            ) : null}
        </HStack>
    )
}
