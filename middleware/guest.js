export default defineNuxtRouteMiddleware((to) => {
    const authStore = useAuthStore()

    // 클라이언트 사이드에서만 실행
    if (process.client) {
        // 이미 로그인된 경우 홈페이지로 리다이렉트
        if (authStore.isLoggedIn) {
            // 쿼리 파라미터에 redirect가 있으면 그곳으로, 없으면 홈으로
            const redirectTo = to.query.redirect || '/'
            return navigateTo(redirectTo)
        }
    }
})