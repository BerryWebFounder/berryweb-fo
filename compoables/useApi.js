export const useApi = () => {
    const { $api } = useNuxtApp()

    const handleApiError = (error) => {
        const toast = useToast()

        if (error.response) {
            const status = error.response.status
            const message = error.response.data?.message || '오류가 발생했습니다.'

            switch (status) {
                case 401:
                    toast.error('로그인이 필요합니다.')
                    navigateTo('/login')
                    break
                case 403:
                    toast.error('접근 권한이 없습니다.')
                    break
                case 404:
                    toast.error('요청한 리소스를 찾을 수 없습니다.')
                    break
                case 500:
                    toast.error('서버 오류가 발생했습니다.')
                    break
                default:
                    toast.error(message)
            }
        } else if (error.request) {
            toast.error('네트워크 연결을 확인해주세요.')
        } else {
            toast.error('알 수 없는 오류가 발생했습니다.')
        }

        throw error
    }

    return {
        ...$api,
        handleApiError
    }
}