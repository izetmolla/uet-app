/**
 * Shared types for the ContentLoader component and its subcomponents.
 */

import type { ReactNode } from "react"

/** Single breadcrumb link or page (current). */
export interface BreadcrumbItem {
    label: string
    to?: string
}

/** Props for the custom breadcrumb list. */
export interface CustomBreadcrumbProps {
    breadcrumb: BreadcrumbItem[]
}

/** Props for the page header (title, description, breadcrumb, actions). */
export interface ContentLoaderHeaderProps {
    title?: string
    description?: string
    /** Breadcrumb items; current page title is appended if not already present. */
    breadcrumb?: BreadcrumbItem[]
    rightComponent?: ReactNode
    customTitle?: ReactNode
    error?: string
    /**
     * When true, header is not rendered on the page.
     * On web this is used for document meta only; on native it simply hides the header.
     */
    forMeta?: boolean
    /** When true, a separator is shown between the header and the body. Default false. */
    showHeaderSeparator?: boolean
    /** NativeWind class(es) for vertical margin from the separator. Default "mb-6". */
    headerSeparatorMarginY?: string
    /** Merged onto the header row wrapper. */
    headerClassName?: string
}

/** Props for the main ContentLoader wrapper. */
export interface ContentLoaderProps {
    /** Page title; shown in the header when provided. */
    title?: string
    /** Short description; shown in the page header when provided. */
    description?: string
    /** Show loading spinner or customLoader. */
    isLoading?: boolean
    header?: ReactNode
    /** When true, header is shown while loading; otherwise only when content or error is shown. */
    showHeaderOnLoader?: boolean
    /** When set, error state is shown with optional header. */
    error?: Error | null
    /**
     * When true, error UI is compact (e.g. sidebar) instead of a full centered block.
     */
    minimalError?: boolean
    children?: ReactNode
    /** Custom loading UI instead of default spinner. */
    customLoader?: ReactNode
    breadcrumb?: BreadcrumbItem[]
    customTitle?: ReactNode
    rightComponent?: ReactNode
    /**
     * When true: only keep title/description in context (header is not rendered).
     * When false (default): render the header (title, description, breadcrumb).
     */
    forMeta?: boolean
    /** When true, a separator is shown between the header and the body. Default false. */
    showHeaderSeparator?: boolean
    /** NativeWind class(es) for vertical margin from the separator. Default "mb-6". */
    headerSeparatorMarginY?: string
    /** Forwarded to the page header wrapper. */
    headerClassName?: string
    /**
     * When true, loading and error states fill the available space and are centered
     * (e.g. embedded panels). Default false uses a fixed viewport height.
     */
    centered?: boolean
}

/** Shape of API error response (optional fields). */
export interface ApiErrorResponse {
    message?: string
    code?: string
    details?: unknown
}

export interface ContentErrorShape {
    message?: string
    code?: string
    status?: number
    details?: unknown
    error?: boolean
}
