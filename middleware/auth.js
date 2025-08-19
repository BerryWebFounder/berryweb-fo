export default defineNuxtRouteMiddleware((to) => {
    const authStore = useAuthStore()

    // 클라이언트 사이드에서만 실행
    if (process.client) {
        // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
        if (!authStore.isLoggedIn) {
            const currentPath = to.fullPath

            // 로그인 페이지나 회원가입 페이지가 아닌 경우에만 리다이렉트
            if (currentPath !== '/login' && currentPath !== '/register') {
                return navigateTo({
                    path: '/login',
                    query: { redirect: currentPath }
                })
            }
        }
    }
})