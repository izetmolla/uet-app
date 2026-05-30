import type { SharedFileItem, SharedPayload } from "@/types/share-menu"

type RawShareItem = {
    mimeType?: string
    data?: string | string[] | SharedFileItem[]
    extraData?: Record<string, unknown> | null
}

function asSharedItems(
    mimeType: string | undefined,
    data: string | string[] | SharedFileItem[] | undefined,
): SharedFileItem[] {
    if (!data) {
        return []
    }

    if (Array.isArray(data)) {
        if (data.length === 0) {
            return []
        }

        if (typeof data[0] === "string") {
            return (data as string[]).map((entry) => ({
                mimeType: mimeType ?? "application/octet-stream",
                data: entry,
            }))
        }

        return (data as SharedFileItem[]).filter(
            (item): item is SharedFileItem =>
                typeof item?.mimeType === "string" && typeof item?.data === "string",
        )
    }

    if (typeof data !== "string") {
        return []
    }

    return [
        {
            mimeType: mimeType ?? "application/octet-stream",
            data,
        },
    ]
}

export function normalizeSharePayload(raw: RawShareItem | null | undefined): SharedPayload | null {
    if (!raw) {
        return null
    }

    const nestedItems = Array.isArray(raw.data)
        ? raw.data.filter(
              (item): item is SharedFileItem =>
                  typeof item === "object" &&
                  item !== null &&
                  typeof item.mimeType === "string" &&
                  typeof item.data === "string",
          )
        : []

    const items =
        nestedItems.length > 0
            ? nestedItems
            : asSharedItems(raw.mimeType, raw.data as string | string[] | undefined)

    if (items.length === 0) {
        return null
    }

    return {
        items,
        extraData: raw.extraData ?? null,
    }
}
