import { lazy } from "react";

const AppointmentsPage = lazy(() => import("./AppointmentsPage"));
const AuthPage = lazy(() => import("./AuthPage"));
const ContainerDemoPage = lazy(() => import("./ContainerDemoPage"));
const Dashboard3DPage = lazy(() => import("./Dashboard3DPage"));
const DashboardPage = lazy(() => import("./DashboardPage"));
const DataTablePage = lazy(() => import("./DataTablePage"));
const FeaturePage = lazy(() => import("./FeaturePage"));
const FileSourcesViewerPage = lazy(() => import("./FileSourcesViewerPage"));
const HomePage = lazy(() => import("./HomePage"));
const MedicalRAGPage = lazy(() => import("./DimensionsVisualizerPage"));
const SemanticSearchPage = lazy(() => import("./SemanticSearchPage"));
const SourcesViewerLayout = lazy(() => import("./layouts/SourcesViewerLayout"));
const VisualizerLayout = lazy(() => import("./layouts/VisualizerLayout"));
const WebDocsViewerPage = lazy(() => import("./WebDocsViewerPage"));

export {
  AppointmentsPage,
  AuthPage,
  ContainerDemoPage,
  Dashboard3DPage,
  DashboardPage,
  DataTablePage,
  FeaturePage,
  FileSourcesViewerPage,
  HomePage,
  MedicalRAGPage,
  SemanticSearchPage,
  SourcesViewerLayout,
  VisualizerLayout,
  WebDocsViewerPage,
};
