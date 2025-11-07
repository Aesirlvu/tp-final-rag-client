import { lazy } from "react";

const HomePage = lazy(() => import("./HomePage"));
const FeaturePage = lazy(() => import("./FeaturePage"));
const DashboardPage = lazy(() => import("./DashboardPage"));
const AuthPage = lazy(() => import("./AuthPage"));
const ContainerDemoPage = lazy(() => import("./ContainerDemoPage"));
const MedicalRAGPage = lazy(() => import("./DimensionsVisualizer"));
const DataTablePage = lazy(() => import("./DataTablePage"));

export {
  HomePage,
  FeaturePage,
  DashboardPage,
  ContainerDemoPage,
  AuthPage,
  MedicalRAGPage,
  DataTablePage,
};
