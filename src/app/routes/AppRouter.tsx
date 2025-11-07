import { Navigate, Route, Routes } from "react-router-dom";
import { AuthPage } from "../pages";
import AppRoutes, { type IRoute } from "./routes";
import { ProtectedRoute } from "./ProtectedRoute";
import React from "react";

const getRouteElement = (route: IRoute) => {
  if (!route.Component) return <Navigate to="/" replace />;
  return route.requiresAuth ? (
    <ProtectedRoute>
      <route.Component />
    </ProtectedRoute>
  ) : (
    <route.Component />
  );
};

const renderRoutes = (routes: IRoute[]) => {
  return routes.map((route) => {
    if (route.children) {
      return (
        <Route
          key={route.path || "index"}
          path={route.path}
          element={getRouteElement(route)}
        >
          {renderRoutes(route.children)}
        </Route>
      );
    }
    return (
      <Route
        index={!!route.index}
        key={route.path || "index"}
        path={route.path}
        element={getRouteElement(route)}
      />
    );
  });
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      {renderRoutes(AppRoutes)}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
