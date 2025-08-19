export const useFormat = () => {
    const formatPrice = (price, currency = 'KRW') => {
        if (typeof price !== 'number' || isNaN(price)) {
            return '₩0'
        }

        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price)
    }

    const formatDate = (date, options = {}) => {
        if (!date) return ''

        const dateObj = typeof date === 'string' ? new Date(date) : date

        if (isNaN(dateObj.getTime())) {
            return ''
        }

        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...options
        }

        return dateObj.toLocaleDateString('ko-KR', defaultOptions)
    }

    const formatRelativeTime = (date) => {
        if (!date) return ''

        const dateObj = typeof date === 'string' ? new Date(date) : date

        if (isNaN(dateObj.getTime())) {
            return ''
        }

        const now = new Date()
        const diffInSeconds = Math.floor((now - dateObj) / 1000)

        if (diffInSeconds < 60) {
            return '방금 전'
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60)
        if (diffInMinutes < 60) {
            return `${diffInMinutes}분 전`
        }

        const diffInHours = Math.floor(diffInMinutes / 60)
        if (diffInHours < 24) {
            return `${diffInHours}시간 전`
        }

        const diffInDays = Math.floor(diffInHours / 24)
        if (diffInDays < 30) {
            return `${diffInDays}일 전`
        }

        const diffInMonths = Math.floor(diffInDays / 30)
        if (diffInMonths < 12) {
            return `${diffInMonths}개월 전`
        }

        const diffInYears = Math.floor(diffInMonths / 12)
        return `${diffInYears}년 전`
    }

    const formatPhone = (phone) => {
        if (!phone) return ''

        const cleaned = phone.replace(/\D/g, '')

        if (cleaned.length === 11 && cleaned.startsWith('010')) {
            return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
        }

        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
        }

        if (cleaned.length === 11 && cleaned.startsWith('02')) {
            return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3')
        }

        return phone
    }

    const truncateText = (text, maxLength = 100) => {
        if (!text || text.length <= maxLength) {
            return text
        }

        return text.slice(0, maxLength) + '...'
    }

    return {
        formatPrice,
        formatDate,
        formatRelativeTime,
        formatPhone,
        truncateText
    }
}