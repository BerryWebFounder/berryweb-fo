/**
 * 가격 포맷팅
 * @param {number} price - 가격
 * @param {string} currency - 통화 (기본값: KRW)
 * @returns {string} 포맷된 가격
 */
export const formatPrice = (price, currency = 'KRW') => {
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

/**
 * 숫자를 천 단위로 구분하여 포맷팅
 * @param {number} number - 숫자
 * @returns {string} 포맷된 숫자
 */
export const formatNumber = (number) => {
    if (typeof number !== 'number' || isNaN(number)) {
        return '0'
    }

    return new Intl.NumberFormat('ko-KR').format(number)
}

/**
 * 날짜 포맷팅
 * @param {string|Date} date - 날짜
 * @param {object} options - 포맷 옵션
 * @returns {string} 포맷된 날짜
 */
export const formatDate = (date, options = {}) => {
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

/**
 * 상대적 시간 포맷팅 (예: 2시간 전)
 * @param {string|Date} date - 날짜
 * @returns {string} 상대적 시간
 */
export const formatRelativeTime = (date) => {
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

/**
 * 전화번호 포맷팅
 * @param {string} phone - 전화번호
 * @returns {string} 포맷된 전화번호
 */
export const formatPhone = (phone) => {
    if (!phone) return ''

    // 숫자만 추출
    const cleaned = phone.replace(/\D/g, '')

    // 휴대폰 번호 (010-XXXX-XXXX)
    if (cleaned.length === 11 && cleaned.startsWith('010')) {
        return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
    }

    // 일반 전화번호 (02-XXX-XXXX, 031-XXX-XXXX 등)
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
    }

    if (cleaned.length === 11 && cleaned.startsWith('02')) {
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3')
    }

    return phone
}

/**
 * 이메일 유효성 검사
 * @param {string} email - 이메일
 * @returns {boolean} 유효한지 여부
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * 전화번호 유효성 검사
 * @param {string} phone - 전화번호
 * @returns {boolean} 유효한지 여부
 */
export const isValidPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length >= 10 && cleaned.length <= 11
}

/**
 * 비밀번호 강도 체크
 * @param {string} password - 비밀번호
 * @returns {object} 강도 정보
 */
export const checkPasswordStrength = (password) => {
    if (!password) {
        return { score: 0, feedback: '비밀번호를 입력하세요' }
    }

    let score = 0
    const feedback = []

    // 길이 체크
    if (password.length >= 8) {
        score += 1
    } else {
        feedback.push('8자 이상')
    }

    // 소문자 체크
    if (/[a-z]/.test(password)) {
        score += 1
    } else {
        feedback.push('소문자 포함')
    }

    // 대문자 체크
    if (/[A-Z]/.test(password)) {
        score += 1
    } else {
        feedback.push('대문자 포함')
    }

    // 숫자 체크
    if (/[0-9]/.test(password)) {
        score += 1
    } else {
        feedback.push('숫자 포함')
    }

    // 특수문자 체크
    if (/[^a-zA-Z0-9]/.test(password)) {
        score += 1
    } else {
        feedback.push('특수문자 포함')
    }

    const levels = ['매우 약함', '약함', '보통', '강함', '매우 강함']
    const level = levels[Math.min(score, 4)]

    return {
        score,
        level,
        feedback: feedback.length > 0 ? feedback.join(', ') + ' 필요' : '안전한 비밀번호입니다'
    }
}

/**
 * 텍스트 줄이기 (말줄임표)
 * @param {string} text - 텍스트
 * @param {number} maxLength - 최대 길이
 * @returns {string} 줄여진 텍스트
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) {
        return text
    }

    return text.slice(0, maxLength) + '...'
}

/**
 * 배열을 청크 단위로 분할
 * @param {Array} array - 배열
 * @param {number} size - 청크 크기
 * @returns {Array} 분할된 배열
 */
export const chunkArray = (array, size) => {
    const chunks = []
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size))
    }
    return chunks
}

/**
 * 객체에서 빈 값 제거
 * @param {object} obj - 객체
 * @returns {object} 정리된 객체
 */
export const removeEmptyValues = (obj) => {
    const cleaned = {}

    for (const [key, value] of Object.entries(obj)) {
        if (value !== null && value !== undefined && value !== '') {
            cleaned[key] = value
        }
    }

    return cleaned
}

/**
 * 쿼리 문자열 생성
 * @param {object} params - 파라미터 객체
 * @returns {string} 쿼리 문자열
 */
export const buildQueryString = (params) => {
    const cleanParams = removeEmptyValues(params)
    const searchParams = new URLSearchParams()

    for (const [key, value] of Object.entries(cleanParams)) {
        if (Array.isArray(value)) {
            value.forEach(item => searchParams.append(key, item))
        } else {
            searchParams.append(key, value)
        }
    }

    return searchParams.toString()
}

/**
 * 이미지 URL 생성
 * @param {string} filename - 파일명
 * @param {string} size - 크기 (썸네일용)
 * @returns {string} 이미지 URL
 */
export const getImageUrl = (filename, size = null) => {
    if (!filename) {
        return '/images/no-image.png'
    }

    const config = useRuntimeConfig()
    const baseUrl = config.public.uploadUrl || '/uploads'

    if (size) {
        // 썸네일 버전이 있다면
        const parts = filename.split('.')
        const name = parts.slice(0, -1).join('.')
        const ext = parts[parts.length - 1]
        return `${baseUrl}/${name}_${size}.${ext}`
    }

    return `${baseUrl}/${filename}`
}

/**
 * 파일 크기 포맷팅
 * @param {number} bytes - 바이트 크기
 * @returns {string} 포맷된 크기
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 색상 유틸리티
 */
export const colorUtils = {
    /**
     * HEX를 RGB로 변환
     * @param {string} hex - HEX 색상
     * @returns {object} RGB 값
     */
    hexToRgb: (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null
    },

    /**
     * RGB를 HEX로 변환
     * @param {number} r - Red
     * @param {number} g - Green
     * @param {number} b - Blue
     * @returns {string} HEX 색상
     */
    rgbToHex: (r, g, b) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    }
}

/**
 * 로컬 스토리지 유틸리티
 */
export const storage = {
    /**
     * 값 저장
     * @param {string} key - 키
     * @param {any} value - 값
     */
    set: (key, value) => {
        if (process.client) {
            try {
                localStorage.setItem(key, JSON.stringify(value))
            } catch (error) {
                console.error('Failed to save to localStorage:', error)
            }
        }
    },

    /**
     * 값 가져오기
     * @param {string} key - 키
     * @param {any} defaultValue - 기본값
     * @returns {any} 저장된 값
     */
    get: (key, defaultValue = null) => {
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
    },

    /**
     * 값 제거
     * @param {string} key - 키
     */
    remove: (key) => {
        if (process.client) {
            try {
                localStorage.removeItem(key)
            } catch (error) {
                console.error('Failed to remove from localStorage:', error)
            }
        }
    },

    /**
     * 모든 값 제거
     */
    clear: () => {
        if (process.client) {
            try {
                localStorage.clear()
            } catch (error) {
                console.error('Failed to clear localStorage:', error)
            }
        }
    }
}

/**
 * 디바운스 함수
 * @param {Function} func - 실행할 함수
 * @param {number} wait - 대기 시간
 * @returns {Function} 디바운스된 함수
 */
export const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

/**
 * 스로틀 함수
 * @param {Function} func - 실행할 함수
 * @param {number} limit - 제한 시간
 * @returns {Function} 스로틀된 함수
 */
export const throttle = (func, limit) => {
    let inThrottle
    return function() {
        const args = arguments
        const context = this
        if (!inThrottle) {
            func.apply(context, args)
            inThrottle = true
            setTimeout(() => inThrottle = false, limit)
        }
    }
}