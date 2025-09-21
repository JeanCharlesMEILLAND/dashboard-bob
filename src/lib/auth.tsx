'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface User {
  id: number
  username: string
  email: string
  confirmed: boolean
  blocked: boolean
  createdAt: string
  updatedAt: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (identifier: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!token && !!user

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    const storedToken = localStorage.getItem('dashboardToken')
    const storedUser = localStorage.getItem('dashboardUser')

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setToken(storedToken)
        setUser(parsedUser)

        // Configurer axios avec le token
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`

        // Définir le cookie pour le middleware
        document.cookie = `dashboardToken=${storedToken}; path=/; max-age=86400; samesite=strict`
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error)
        logout()
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (identifier: string, password: string) => {
    try {
      const response = await axios.post('http://72.60.132.74:1337/api/auth/local', {
        identifier,
        password
      })

      const { jwt, user: userData } = response.data

      if (jwt && userData) {
        setToken(jwt)
        setUser(userData)

        // Stocker dans localStorage
        localStorage.setItem('dashboardToken', jwt)
        localStorage.setItem('dashboardUser', JSON.stringify(userData))

        // Configurer axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`

        // Définir le cookie pour le middleware
        document.cookie = `dashboardToken=${jwt}; path=/; max-age=86400; samesite=strict`

        router.push('/')
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)

    // Supprimer de localStorage
    localStorage.removeItem('dashboardToken')
    localStorage.removeItem('dashboardUser')

    // Supprimer le header axios
    delete axios.defaults.headers.common['Authorization']

    // Supprimer le cookie
    document.cookie = 'dashboardToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'

    router.push('/auth/login')
  }

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook pour protéger les composants
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  return { isAuthenticated, isLoading }
}