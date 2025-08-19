export const useAsync = (asyncFunction, options = {}) => {
    const {
        immediate = true,
        throwOnError = false
    } = options

    const data = ref(null)
    const error = ref(null)
    const loading = ref(false)

    const execute = async (...args) => {
        try {
            loading.value = true
            error.value = null

            const result = await asyncFunction(...args)
            data.value = result

            return result
        } catch (err) {
            error.value = err

            if (throwOnError) {
                throw err
            }
        } finally {
            loading.value = false
        }
    }

    if (immediate) {
        execute()
    }

    return {
        data: readonly(data),
        error: readonly(error),
        loading: readonly(loading),
        execute
    }
}