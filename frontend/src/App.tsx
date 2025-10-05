import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Reports } from './pages/Reports';
import { Messages } from './pages/Messages';
import { Cases } from './pages/Cases';
import { Library } from './pages/Library';
import { Announcements } from './pages/Announcements';
import { FAQ } from './pages/FAQ';
import { Entities } from './pages/Entities';
import { Users } from './pages/admin/Users';
import { AccessRequests } from './pages/admin/AccessRequests';
import { Roles } from './pages/admin/Roles';
import { PasswordPolicy } from './pages/admin/PasswordPolicy';
import { Login } from './features/auth/routes/Login';
import { Register } from './features/auth/routes/Register';
import { Toaster } from './components/ui/sonner';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AdminRoute() {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="reports" element={<Reports />} />
        <Route path="messages" element={<Messages />} />
        <Route path="cases" element={<Cases />} />
        <Route path="library" element={<Library />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="entities" element={<Entities />} />
        
        <Route path="admin" element={<AdminRoute />}>
          <Route path="users" element={<Users />} />
          <Route path="requests" element={<AccessRequests />} />
          <Route path="roles" element={<Roles />} />
          <Route path="password-policy" element={<PasswordPolicy />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <div className="size-full">
          <AppRoutes />
          <Toaster />
        </div>
      </AuthProvider>
    </HashRouter>
  );
}
