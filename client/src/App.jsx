import { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
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
    <Suspense
      fallback={(
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
          <CircularProgress color="primary" />
        </Box>
      )}
    >
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
  </MainLayout>
);

export default App;
