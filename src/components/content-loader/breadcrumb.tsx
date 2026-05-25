import { type Href, Link } from "expo-router"
import { Fragment, type FC } from "react"
import { Pressable } from "react-native"

import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"

import type { CustomBreadcrumbProps } from "./types"

function getBasePath(path: string) {
    return path.startsWith("/") ? path : `/${path}`
}

/**
 * Renders a breadcrumb trail from an array of { label, to? } items.
 * Items with `to` render as links; the last or without `to` render as current page.
 */
export const ContentLoaderBreadcrumb: FC<CustomBreadcrumbProps> = ({
    breadcrumb,
}) => {
    if (!breadcrumb.length) return null

    return (
        <HStack className="flex-wrap items-center gap-1">
            {breadcrumb.map((item, index) => {
                const isLast = index === breadcrumb.length - 1

                return (
                    <Fragment key={`${item.label}-${index}`}>
                        {item.to && !isLast ? (
                            <Link href={getBasePath(item.to) as Href} asChild>
                                <Pressable accessibilityRole="link">
                                    <Text
                                        size="sm"
                                        className="text-primary-500"
                                    >
                                        {item.label}
                                    </Text>
                                </Pressable>
                            </Link>
                        ) : (
                            <Text
                                size="sm"
                                className={
                                    isLast
                                        ? "font-medium text-typography-900"
                                        : "text-typography-500"
                                }
                            >
                                {item.label}
                            </Text>
                        )}
                        {!isLast ? (
                            <Text size="sm" className="text-typography-400">
                                /
                            </Text>
                        ) : null}
                    </Fragment>
                )
            })}
        </HStack>
    )
}
