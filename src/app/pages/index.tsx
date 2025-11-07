import { lazy } from "react";

const HomePage = lazy(() => import("./HomePage"));
const FeaturePage = lazy(() => import("./FeaturePage"));
const DashboardPage = lazy(() => import("./DashboardPage"));
const AuthPage = lazy(() => import("./AuthPage"));
const ContainerDemoPage = lazy(() => import("./ContainerDemoPage"));
const MedicalRAGPage = lazy(() => import("./DimensionsVisualizerPage"));
const DataTablePage = lazy(() => import("./DataTablePage"));
const AppointmentsPage = lazy(() => import("./AppointmentsPage"));
const WebDocsViewerPage = lazy(() => import("./WebDocsViewerPage"));
const FileSourcesViewerPage = lazy(() => import("./FileSourcesViewerPage"));
const SourcesViewerLayout = lazy(() => import("./layouts/SourcesViewerLayout"));
const VisualizerLayout = lazy(() => import("./layouts/VisualizerLayout"));

export {
  HomePage,
  FeaturePage,
  DashboardPage,
  ContainerDemoPage,
  AuthPage,
  MedicalRAGPage,
  DataTablePage,
  AppointmentsPage,
  WebDocsViewerPage,
  FileSourcesViewerPage,
  SourcesViewerLayout,
  VisualizerLayout
};
