import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth-context';
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
import { Login } from './pages/Login';
import { Toaster } from './components/ui/sonner';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      
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
        
        <Route path="admin">
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