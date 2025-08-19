export const useCartStore = defineStore('cart', () => {
    const items = ref([])

    const totalItems = computed(() => {
        return items.value.reduce((total, item) => total + item.quantity, 0)
    })

    const totalAmount = computed(() => {
        return items.value.reduce((total, item) => {
            const price = item.product.salePrice || item.product.price
            return total + (price * item.quantity)
        }, 0)
    })

    // Initialize from localStorage
    const initCart = () => {
        if (process.client) {
            const savedCart = localStorage.getItem('cart-items')
            if (savedCart) {
                try {
                    items.value = JSON.parse(savedCart)
                } catch (e) {
                    console.error('Failed to parse saved cart:', e)
                    items.value = []
                }
            }
        }
    }

    // Save to localStorage
    const saveCart = () => {
        if (process.client) {
            localStorage.setItem('cart-items', JSON.stringify(items.value))
        }
    }

    // Add item to cart
    const addItem = (product, quantity = 1, options = null) => {
        const existingItemIndex = items.value.findIndex(item =>
            item.product.id === product.id &&
            JSON.stringify(item.options) === JSON.stringify(options)
        )

        if (existingItemIndex > -1) {
            items.value[existingItemIndex].quantity += quantity
        } else {
            items.value.push({
                id: Date.now() + Math.random(),
                product,
                quantity,
                options,
                addedAt: new Date().toISOString()
            })
        }

        saveCart()
    }

    // Update item quantity
    const updateQuantity = (itemId, quantity) => {
        const itemIndex = items.value.findIndex(item => item.id === itemId)
        if (itemIndex > -1) {
            if (quantity <= 0) {
                items.value.splice(itemIndex, 1)
            } else {
                items.value[itemIndex].quantity = quantity
            }
            saveCart()
        }
    }

    // Remove item from cart
    const removeItem = (itemId) => {
        const itemIndex = items.value.findIndex(item => item.id === itemId)
        if (itemIndex > -1) {
            items.value.splice(itemIndex, 1)
            saveCart()
        }
    }

    // Clear cart
    const clearCart = () => {
        items.value = []
        saveCart()
    }

    // Get item by product id
    const getItemByProductId = (productId) => {
        return items.value.find(item => item.product.id === productId)
    }

    // Check if product is in cart
    const isInCart = (productId) => {
        return items.value.some(item => item.product.id === productId)
    }

    return {
        items: readonly(items),
        totalItems,
        totalAmount,
        initCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        getItemByProductId,
        isInCart
    }
})