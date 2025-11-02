import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor with proper error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message)
      return Promise.reject({
        response: {
          data: { detail: 'Network error. Please check your connection.' },
          status: 0
        }
      })
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.error('Unauthorized access')
      // Clear storage and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }

    // Handle non-JSON responses
    if (error.response?.data && typeof error.response.data === 'string') {
      try {
        error.response.data = JSON.parse(error.response.data)
      } catch (e) {
        error.response.data = { detail: error.response.data }
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
