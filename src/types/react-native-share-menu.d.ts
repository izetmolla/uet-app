declare module "react-native-share-menu" {
    export type ShareData = {
        mimeType?: string
        data?: string | string[] | Array<{ mimeType: string; data: string }>
        extraData?: Record<string, unknown> | null
    }

    export type ShareListener = {
        remove: () => void
    }

    export const ShareMenuReactView: {
        dismissExtension: (error?: string | null) => void
        openApp: () => void
        continueInApp: (extraData?: Record<string, unknown> | null) => void
        data: () => Promise<ShareData>
    }

    const ShareMenu: {
        getInitialShare: (callback: (item?: ShareData | null) => void) => void
        addNewShareListener: (
            callback: (item?: ShareData | null) => void,
        ) => ShareListener
    }

    export default ShareMenu
}
