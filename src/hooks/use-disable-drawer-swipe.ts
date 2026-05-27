import { useFocusEffect, useNavigation } from "expo-router"
import { useCallback } from "react"

type NavigationWithDrawerParent = {
    getParent: () => NavigationWithDrawerParent | undefined
    getState: () => { type: string } | undefined
    setOptions: (options: { swipeEnabled: boolean }) => void
}

function findDrawerNavigation(
    navigation: NavigationWithDrawerParent
): NavigationWithDrawerParent | undefined {
    let parent = navigation.getParent()
    while (parent) {
        if (parent.getState()?.type === "drawer") {
            return parent
        }
        parent = parent.getParent()
    }
    return undefined
}

/** Disables the root drawer edge-swipe while this screen is focused. */
export function useDisableDrawerSwipe() {
    const navigation = useNavigation()

    useFocusEffect(
        useCallback(() => {
            const drawer = findDrawerNavigation(navigation)
            drawer?.setOptions({ swipeEnabled: false })
            return () => {
                drawer?.setOptions({ swipeEnabled: true })
            }
        }, [navigation])
    )
}
