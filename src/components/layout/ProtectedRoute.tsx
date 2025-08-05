import type { JSX } from 'react'
import { Navigate } from 'react-router-dom'

const getUser = () => {
  try {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return token && user.role ? user : null
  } catch {
    return null
  }
}

export const ProtectedRoute = ({ children, role }: { children: JSX.Element; role: string }) => {
  const user = getUser()
  if (!user || user.role !== role) return <Navigate to="/login" />
  return children
}