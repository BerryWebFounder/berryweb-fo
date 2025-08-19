export const useDebounce = (fn, delay = 300) => {
    const timeoutRef = ref()

    const debouncedFunction = (...args) => {
        clearTimeout(timeoutRef.value)
        timeoutRef.value = setTimeout(() => {
            fn(...args)
        }, delay)
    }

    const cancel = () => {
        clearTimeout(timeoutRef.value)
    }

    onUnmounted(() => {
        cancel()
    })

    return { debouncedFunction, cancel }
}