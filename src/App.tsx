import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import { getAntdTheme } from "./config/theme";
import { useAuthStore } from "./store/authStore";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardLayout from "./components/DashboardLayout";
import TasksPage from "./pages/TasksPage";
import CategoriesPage from "./pages/CategoriesPage";
import routesConfig from "./config/routes.json";

// Component mapping
const componentMap: Record<string, React.ComponentType> = {
  LoginPage,
  RegisterPage,
  DashboardLayout,
  TasksPage,
  CategoriesPage,
};

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);

  // Eğer authenticated değilse veya token yoksa login'e yönlendir
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return !isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

function App() {
  return (
    <ConfigProvider theme={getAntdTheme(false)}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          {routesConfig.publicRoutes.map((route) => {
            const Component = componentMap[route.component];
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <PublicRoute>
                    <Component />
                  </PublicRoute>
                }
              />
            );
          })}

          {/* Protected Routes */}
          {routesConfig.protectedRoutes.map((route) => {
            const Component = componentMap[route.component];
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <ProtectedRoute>
                    <Component />
                  </ProtectedRoute>
                }
              >
                {route.children?.map((child) => {
                  const ChildComponent = componentMap[child.component];
                  return child.index ? (
                    <Route key="index" index element={<ChildComponent />} />
                  ) : (
                    <Route
                      key={child.path}
                      path={child.path}
                      element={<ChildComponent />}
                    />
                  );
                })}
              </Route>
            );
          })}

          {/* Redirects */}
          {routesConfig.redirects.map((redirect) => (
            <Route
              key={redirect.from}
              path={redirect.from}
              element={<Navigate to={redirect.to} replace />}
            />
          ))}
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
