export const useIntersectionObserver = (target, callback, options = {}) => {
    const {
        threshold = 0.1,
        root = null,
        rootMargin = '0px'
    } = options

    const isSupported = ref(false)
    const isIntersecting = ref(false)

    let observer = null

    const cleanup = () => {
        if (observer) {
            observer.disconnect()
            observer = null
        }
    }

    const observe = () => {
        cleanup()

        const element = unref(target)
        if (!element) return

        observer = new IntersectionObserver((entries) => {
            const entry = entries[0]
            isIntersecting.value = entry.isIntersecting

            if (callback) {
                callback(entry)
            }
        }, {
            threshold,
            root,
            rootMargin
        })

        observer.observe(element)
    }

    onMounted(() => {
        isSupported.value = typeof IntersectionObserver !== 'undefined'

        if (isSupported.value) {
            observe()
        }
    })

    onUnmounted(() => {
        cleanup()
    })

    watch(target, () => {
        if (isSupported.value) {
            observe()
        }
    })

    return {
        isSupported: readonly(isSupported),
        isIntersecting: readonly(isIntersecting),
        observe,
        cleanup
    }
}