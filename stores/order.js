export const useOrderStore = defineStore('order', () => {
    const { $api } = useNuxtApp()
    const authStore = useAuthStore()

    const orders = ref([])
    const currentOrder = ref(null)
    const loading = ref(false)
    const error = ref(null)

    // Create order
    const createOrder = async (orderData) => {
        try {
            loading.value = true
            error.value = null

            if (!authStore.isLoggedIn) {
                throw new Error('로그인이 필요합니다.')
            }

            const response = await $api.order.post('/v1/orders', {
                customerId: authStore.user.id,
                shippingAddressId: orderData.shippingAddressId,
                billingAddressId: orderData.billingAddressId,
                discountAmount: orderData.discountAmount || 0,
                shippingAmount: orderData.shippingAmount || 0,
                taxAmount: orderData.taxAmount || 0,
                notes: orderData.notes || '',
                orderItems: orderData.orderItems.map(item => ({
                    productId: item.product.id,
                    productSku: item.product.sku || '',
                    productName: item.product.name,
                    quantity: item.quantity,
                    unitPrice: item.product.salePrice || item.product.price,
                    discountAmount: 0
                }))
            })

            if (response.data.success) {
                currentOrder.value = response.data.data
                return response.data.data
            } else {
                throw new Error(response.data.message || '주문 생성에 실패했습니다.')
            }
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    // Get order by id
    const fetchOrder = async (orderId) => {
        try {
            loading.value = true
            error.value = null

            const response = await $api.order.get(`/v1/orders/${orderId}`)

            if (response.data.success) {
                currentOrder.value = response.data.data
                return response.data.data
            } else {
                throw new Error(response.data.message || '주문 정보를 불러오는데 실패했습니다.')
            }
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    // Get orders by customer
    const fetchCustomerOrders = async (page = 0, size = 20) => {
        try {
            loading.value = true
            error.value = null

            if (!authStore.isLoggedIn) {
                throw new Error('로그인이 필요합니다.')
            }

            const response = await $api.order.get(`/v1/orders/customer/${authStore.user.id}`, {
                params: { page, size }
            })

            if (response.data.success) {
                orders.value = response.data.data.content || []
                return response.data.data
            } else {
                throw new Error(response.data.message || '주문 목록을 불러오는데 실패했습니다.')
            }
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    // Update order status
    const updateOrderStatus = async (orderId, status, reason = '') => {
        try {
            loading.value = true
            error.value = null

            const response = await $api.order.put(`/v1/orders/${orderId}/status`, null, {
                params: { status, reason }
            })

            if (response.data.success) {
                currentOrder.value = response.data.data
                return response.data.data
            } else {
                throw new Error(response.data.message || '주문 상태 변경에 실패했습니다.')
            }
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    // Cancel order
    const cancelOrder = async (orderId, reason = '') => {
        try {
            loading.value = true
            error.value = null

            const response = await $api.order.put(`/v1/orders/${orderId}/cancel`, null, {
                params: { reason }
            })

            if (response.status === 200) {
                // Refresh current order
                if (currentOrder.value?.orderId === orderId) {
                    await fetchOrder(orderId)
                }
                return true
            } else {
                throw new Error('주문 취소에 실패했습니다.')
            }
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    // Create payment for order
    const createPayment = async (orderId, paymentData) => {
        try {
            loading.value = true
            error.value = null

            if (!authStore.isLoggedIn) {
                throw new Error('로그인이 필요합니다.')
            }

            const response = await $api.payment.post('/v1/payments', {
                orderId,
                customerId: authStore.user.id,
                paymentMethodId: paymentData.paymentMethodId,
                paymentAmount: paymentData.paymentAmount,
                paymentGateway: paymentData.paymentGateway || 'TEST',
                transactionId: paymentData.transactionId || `tx_${Date.now()}`
            })

            if (response.data.success) {
                return response.data.data
            } else {
                throw new Error(response.data.message || '결제 생성에 실패했습니다.')
            }
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    // Process payment
    const processPayment = async (paymentId, gatewayResponse = 'SUCCESS') => {
        try {
            loading.value = true
            error.value = null

            const response = await $api.payment.post(`/v1/payments/${paymentId}/process`, gatewayResponse, {
                headers: {
                    'Content-Type': 'text/plain'
                }
            })

            if (response.data.success) {
                return response.data.data
            } else {
                throw new Error(response.data.message || '결제 처리에 실패했습니다.')
            }
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        orders: readonly(orders),
        currentOrder: readonly(currentOrder),
        loading: readonly(loading),
        error: readonly(error),
        createOrder,
        fetchOrder,
        fetchCustomerOrders,
        updateOrderStatus,
        cancelOrder,
        createPayment,
        processPayment
    }
})