export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const token = ref(null)
    const isLoggedIn = computed(() => !!token.value)

    // Initialize from localStorage
    const initAuth = () => {
        if (process.client) {
            const savedToken = localStorage.getItem('auth-token')
            const savedUser = localStorage.getItem('auth-user')

            if (savedToken) {
                token.value = savedToken
            }

            if (savedUser) {
                try {
                    user.value = JSON.parse(savedUser)
                } catch (e) {
                    console.error('Failed to parse saved user:', e)
                    localStorage.removeItem('auth-user')
                }
            }
        }
    }

    // Login
    const login = async (credentials) => {
        try {
            // 실제 로그인 API 호출은 사용자 서비스가 필요합니다
            // 여기서는 Mock 데이터를 사용합니다
            const mockResponse = {
                token: 'mock-jwt-token-' + Date.now(),
                user: {
                    id: 1,
                    username: credentials.username,
                    email: credentials.email || `${credentials.username}@example.com`,
                    name: credentials.username,
                    role: 'USER'
                }
            }

            token.value = mockResponse.token
            user.value = mockResponse.user

            if (process.client) {
                localStorage.setItem('auth-token', mockResponse.token)
                localStorage.setItem('auth-user', JSON.stringify(mockResponse.user))
            }

            return { success: true }
        } catch (error) {
            console.error('Login failed:', error)
            return { success: false, error: error.message }
        }
    }

    // Logout
    const logout = () => {
        token.value = null
        user.value = null

        if (process.client) {
            localStorage.removeItem('auth-token')
            localStorage.removeItem('auth-user')
        }

        navigateTo('/')
    }

    // Register
    const register = async (userData) => {
        try {
            // Mock registration
            const mockResponse = {
                token: 'mock-jwt-token-' + Date.now(),
                user: {
                    id: Date.now(),
                    username: userData.username,
                    email: userData.email,
                    name: userData.name || userData.username,
                    role: 'USER'
                }
            }

            token.value = mockResponse.token
            user.value = mockResponse.user

            if (process.client) {
                localStorage.setItem('auth-token', mockResponse.token)
                localStorage.setItem('auth-user', JSON.stringify(mockResponse.user))
            }

            return { success: true }
        } catch (error) {
            console.error('Registration failed:', error)
            return { success: false, error: error.message }
        }
    }

    return {
        user: readonly(user),
        token: readonly(token),
        isLoggedIn,
        initAuth,
        login,
        logout,
        register
    }
})