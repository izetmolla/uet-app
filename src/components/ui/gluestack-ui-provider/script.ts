export const script = (mode: string) => {
    const documentElement = document.documentElement
    const classList = documentElement.classList

    if (mode === "system") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        classList.add(isDark ? "dark" : "light")
        classList.remove(isDark ? "light" : "dark")
        documentElement.style.colorScheme = isDark ? "dark" : "light"
        return
    }

    classList.add(mode)
    classList.remove(mode === "light" ? "dark" : "light")
    documentElement.style.colorScheme = mode
}
