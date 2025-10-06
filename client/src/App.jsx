import { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Container } from '@mui/material';
import { routes } from './routes.js';
import { MainLayout } from './layouts/MainLayout.jsx';
import { useAuth } from './features/auth/AuthContext.jsx';

const RouteGuard = ({ requiresAuth, element }) => {
  const { user } = useAuth();
  const location = useLocation();
  if (requiresAuth && !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return element;
};

const App = () => (
  <MainLayout>
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Suspense fallback={<CircularProgress />}>
        <Routes>
          {routes.map(({ path, Component, requiresAuth }) => (
            <Route
              key={path}
              path={path}
              element={<RouteGuard requiresAuth={requiresAuth} element={<Component />} />}
            />
          ))}
        </Routes>
      </Suspense>
    </Container>
  </MainLayout>
);

export default App;
