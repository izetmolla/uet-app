import { type FC, useEffect, useMemo, useState } from "react"

import { Box } from "@/components/ui/box"
import { Center } from "@/components/ui/center"

import { ContentLoaderContext } from "./context"
import { DefaultSpinner } from "./default-spinner"
import { ContentLoaderErrorView } from "./error-view"
import { ContentLoaderHeader } from "./header"
import type { ContentLoaderProps } from "./types"

/** Shared header props derived from ContentLoader props. */
function useHeaderProps(
    props: ContentLoaderProps & {
        errorMessage?: string
        title: string
        description: string
    }
) {
    const {
        title,
        description,
        breadcrumb,
        rightComponent,
        customTitle,
        forMeta,
        errorMessage,
        header,
    } = props

    return useMemo(
        () => ({
            title,
            description,
            breadcrumb,
            rightComponent,
            customTitle,
            forMeta,
            error: errorMessage,
            showHeaderSeparator: props.showHeaderSeparator,
            headerSeparatorMarginY: props.headerSeparatorMarginY,
            headerClassName: props.headerClassName,
            header,
        }),
        [
            title,
            description,
            breadcrumb,
            rightComponent,
            customTitle,
            forMeta,
            errorMessage,
            props.showHeaderSeparator,
            props.headerSeparatorMarginY,
            props.headerClassName,
            header,
        ]
    )
}

/**
 * Page wrapper that handles loading, error, and success states with a
 * consistent header layout. Children can update title/description via
 * useContentLoader().
 */
const ContentLoader: FC<ContentLoaderProps> = (props) => {
    const {
        title: titleProp,
        description: descriptionProp,
        isLoading,
        showHeaderOnLoader,
        error,
        minimalError,
        children,
        customLoader,
        breadcrumb,
        header,
        centered,
    } = props

    const [title, setTitle] = useState(titleProp ?? "")
    const [description, setDescription] = useState(descriptionProp ?? "")

    useEffect(() => {
        if (titleProp !== undefined) setTitle(titleProp)
    }, [titleProp])

    useEffect(() => {
        if (descriptionProp !== undefined) setDescription(descriptionProp)
    }, [descriptionProp])

    const errorMessage = error?.message

    const contextValue = useMemo(
        () => ({
            title,
            setTitle,
            description,
            setDescription,
        }),
        [title, description]
    )

    const headerProps = useHeaderProps({
        ...props,
        title,
        description,
        breadcrumb,
        errorMessage,
    })

    const centeredState = centered && (isLoading || Boolean(error))

    const loadingBody = (
        <>
            {showHeaderOnLoader ? <ContentLoaderHeader {...headerProps} /> : null}
            {customLoader ?? <DefaultSpinner centered={centered} />}
        </>
    )

    const errorBody = (
        <>
            <ContentLoaderHeader {...headerProps} />
            <ContentLoaderErrorView
                error={error!}
                minimal={minimalError}
                centered={centered}
            />
        </>
    )

    const successBody = (
        <>
            <ContentLoaderHeader {...headerProps} />
            {children}
        </>
    )

    const content = isLoading ? loadingBody : error ? errorBody : successBody

    return (
        <ContentLoaderContext.Provider value={contextValue}>
            {header ?? null}
            {centeredState ? (
                <Center className="min-h-0 w-full flex-1">{content}</Center>
            ) : (
                <Box className="w-full flex-1">{content}</Box>
            )}
        </ContentLoaderContext.Provider>
    )
}

export default ContentLoader

/** @deprecated Use ContentLoaderErrorView for new code. */
export const RenderError = ContentLoaderErrorView

export { useContentLoader, useContentLoaderOptional } from "./context"
export type { ContentLoaderContextValue } from "./context"
export { ContentLoaderHeader } from "./header"
export { ContentLoaderBreadcrumb } from "./breadcrumb"
export { ContentLoaderErrorView } from "./error-view"
export { DefaultSpinner } from "./default-spinner"
export { default as ContentError } from "./error"
export type {
    ApiErrorResponse,
    BreadcrumbItem,
    ContentErrorShape,
    ContentLoaderHeaderProps,
    ContentLoaderProps,
    CustomBreadcrumbProps,
} from "./types"
