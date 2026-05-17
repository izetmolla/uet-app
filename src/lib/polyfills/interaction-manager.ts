/**
 * Drop-in replacement for deprecated React Native InteractionManager.
 * Uses requestIdleCallback when available, otherwise setImmediate.
 */

type SimpleTask = {
    name: string
    run: () => void
}

type PromiseTask = {
    name: string
    gen: () => Promise<void>
}

type Task = SimpleTask | PromiseTask | (() => void)

function scheduleWork(callback: () => void): number {
    if (typeof globalThis.requestIdleCallback === "function") {
        return globalThis.requestIdleCallback(callback, {
            timeout: 100,
        }) as unknown as number
    }

    return setImmediate(callback) as unknown as number
}

function cancelWork(handle: number) {
    if (typeof globalThis.cancelIdleCallback === "function") {
        globalThis.cancelIdleCallback(handle)
        return
    }

    clearImmediate(handle)
}

function rejectAsync(error: Error) {
    setTimeout(() => {
        throw error
    }, 0)
}

function runTask(
    task: Task | undefined,
    resolve: () => void,
    reject: (error: Error) => void
) {
    if (!task) {
        resolve()
        return
    }

    if (typeof task === "function") {
        try {
            task()
            resolve()
        } catch (error) {
            reject(error instanceof Error ? error : new Error(String(error)))
        }
        return
    }

    if (typeof task === "object" && task !== null) {
        if ("gen" in task && typeof task.gen === "function") {
            task.gen().then(resolve, reject)
            return
        }

        if ("run" in task && typeof task.run === "function") {
            try {
                task.run()
                resolve()
            } catch (error) {
                reject(
                    error instanceof Error ? error : new Error(String(error))
                )
            }
            return
        }

        if ("name" in task) {
            reject(
                new TypeError(`Task "${String(task.name)}" missing gen or run.`)
            )
            return
        }
    }

    reject(new TypeError(`Invalid task of type: ${typeof task}`))
}

const InteractionManagerPolyfill = {
    Events: {
        interactionStart: "interactionStart",
        interactionComplete: "interactionComplete",
    },

    runAfterInteractions(task?: Task) {
        let cancelled = false
        let scheduledId: number | undefined

        const promise = new Promise<void>((resolve, reject) => {
            scheduledId = scheduleWork(() => {
                if (cancelled) {
                    return
                }

                runTask(task, resolve, reject)
            })
        })

        promise.catch(rejectAsync)

        return {
            then: promise.then.bind(promise),
            cancel() {
                cancelled = true
                if (scheduledId != null) {
                    cancelWork(scheduledId)
                }
            },
        }
    },

    createInteractionHandle() {
        return -1
    },

    clearInteractionHandle(handle: number) {
        if (!handle && handle !== 0) {
            throw new Error(
                "InteractionManager: Must provide a handle to clear."
            )
        }
    },

    addListener() {
        return {
            remove() {},
        }
    },

    setDeadline() {},
}

export default InteractionManagerPolyfill
