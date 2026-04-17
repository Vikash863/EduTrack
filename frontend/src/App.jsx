import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Results from './pages/Results';
import Subjects from './pages/Subjects';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';

import Layout from './components/Layout';
import RoleRoute from './routes/RoleRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

const router = createBrowserRouter(
  [
    { path: '/', element: <Landing /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    {
      path: '/dashboard',
      element: (
        <RoleRoute allowedRoles={['teacher', 'admin']}>
          <Layout>
            <Dashboard />
          </Layout>
        </RoleRoute>
      ),
    },
    {
      path: '/students',
      element: (
        <RoleRoute allowedRoles={['teacher', 'admin']}>
          <Layout>
            <Students />
          </Layout>
        </RoleRoute>
      ),
    },
    {
      path: '/results',
      element: (
        <RoleRoute allowedRoles={['teacher', 'admin']}>
          <Layout>
            <Results />
          </Layout>
        </RoleRoute>
      ),
    },
    {
      path: '/subjects',
      element: (
        <RoleRoute allowedRoles={['teacher', 'admin']}>
          <Layout>
            <Subjects />
          </Layout>
        </RoleRoute>
      ),
    },
    {
      path: '/analytics',
      element: (
        <RoleRoute allowedRoles={['teacher', 'admin']}>
          <Layout>
            <Analytics />
          </Layout>
        </RoleRoute>
      ),
    },
    { path: '*', element: <NotFound /> },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

function App() {
  return (
    <AuthProvider>
      <Toaster position='top-right' toastOptions={{ duration: 4000, success: { icon: '✅' }, error: { icon: '⚠️' } }} />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;