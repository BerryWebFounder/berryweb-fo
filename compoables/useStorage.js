export const useStorage = () => {
    const set = (key, value) => {
        if (process.client) {
            try {
                localStorage.setItem(key, JSON.stringify(value))
            } catch (error) {
                console.error('Failed to save to localStorage:', error)
            }
        }
    }

    const get = (key, defaultValue = null) => {
        if (process.client) {
            try {
                const item = localStorage.getItem(key)
                return item ? JSON.parse(item) : defaultValue
            } catch (error) {
                console.error('Failed to get from localStorage:', error)
                return defaultValue
            }
        }
        return defaultValue
    }

    const remove = (key) => {
        if (process.client) {
            try {
                localStorage.removeItem(key)
            } catch (error) {
                console.error('Failed to remove from localStorage:', error)
            }
        }
    }

    const clear = () => {
        if (process.client) {
            try {
                localStorage.clear()
            } catch (error) {
                console.error('Failed to clear localStorage:', error)
            }
        }
    }

    return { set, get, remove, clear }
}