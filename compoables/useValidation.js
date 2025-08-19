export const useValidation = () => {
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const isValidPhone = (phone) => {
        const cleaned = phone.replace(/\D/g, '')
        return cleaned.length >= 10 && cleaned.length <= 11
    }

    const isValidPassword = (password) => {
        return password && password.length >= 8
    }

    const checkPasswordStrength = (password) => {
        if (!password) {
            return { score: 0, feedback: '비밀번호를 입력하세요' }
        }

        let score = 0
        const feedback = []

        if (password.length >= 8) score += 1
        else feedback.push('8자 이상')

        if (/[a-z]/.test(password)) score += 1
        else feedback.push('소문자 포함')

        if (/[A-Z]/.test(password)) score += 1
        else feedback.push('대문자 포함')

        if (/[0-9]/.test(password)) score += 1
        else feedback.push('숫자 포함')

        if (/[^a-zA-Z0-9]/.test(password)) score += 1
        else feedback.push('특수문자 포함')

        const levels = ['매우 약함', '약함', '보통', '강함', '매우 강함']
        const level = levels[Math.min(score, 4)]

        return {
            score,
            level,
            feedback: feedback.length > 0 ? feedback.join(', ') + ' 필요' : '안전한 비밀번호입니다'
        }
    }

    return {
        isValidEmail,
        isValidPhone,
        isValidPassword,
        checkPasswordStrength
    }
}