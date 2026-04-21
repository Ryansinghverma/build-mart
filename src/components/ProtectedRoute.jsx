import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Layout from './Layout'
import { PageLoader } from './UI'

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useApp()

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <PageLoader />
    </div>
  )

  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to={`/${user.role}/dashboard`} replace />

  return <Layout>{children}</Layout>
}
