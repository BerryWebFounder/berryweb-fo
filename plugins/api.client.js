import axios from 'axios'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    const shopApi = axios.create({
        baseURL: config.public.shopServiceUrl,
        timeout: 10000
    })

    const orderApi = axios.create({
        baseURL: config.public.orderServiceUrl,
        timeout: 10000
    })

    const paymentApi = axios.create({
        baseURL: config.public.paymentServiceUrl,
        timeout: 10000
    })

    const inventoryApi = axios.create({
        baseURL: config.public.inventoryServiceUrl,
        timeout: 10000
    })

    // Request interceptor - Add auth token
    const addAuthInterceptor = (api) => {
        api.interceptors.request.use((config) => {
            const token = localStorage.getItem('auth-token')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        })
    }

    addAuthInterceptor(shopApi)
    addAuthInterceptor(orderApi)
    addAuthInterceptor(paymentApi)
    addAuthInterceptor(inventoryApi)

    // Response interceptor - Handle errors
    const addErrorInterceptor = (api) => {
        api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Redirect to login if unauthorized
                    localStorage.removeItem('auth-token')
                    navigateTo('/login')
                }
                return Promise.reject(error)
            }
        )
    }

    addErrorInterceptor(shopApi)
    addErrorInterceptor(orderApi)
    addErrorInterceptor(paymentApi)
    addErrorInterceptor(inventoryApi)

    return {
        provide: {
            api: {
                shop: shopApi,
                order: orderApi,
                payment: paymentApi,
                inventory: inventoryApi
            }
        }
    }
})