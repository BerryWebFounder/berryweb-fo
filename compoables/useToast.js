export const useToast = () => {
    return inject('toast', {
        success: (message, options = {}) => console.log('Success:', message),
        error: (message, options = {}) => console.log('Error:', message),
        warning: (message, options = {}) => console.log('Warning:', message),
        info: (message, options = {}) => console.log('Info:', message)
    })
}