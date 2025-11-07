import {
  ContainerDemoPage,
  DashboardPage,
  DataTablePage,
  FeaturePage,
  HomePage,
  MedicalRAGPage,
  AppointmentsPage,
  WebDocsViewerPage,
  FileSourcesViewerPage,
  SourcesViewerLayout,
  VisualizerLayout,
} from "../pages";

export interface IRoute {
  path?: string;
  Component: React.LazyExoticComponent<React.ComponentType<any>>;
  children?: IRoute[];
  index?: boolean;
  requiresAuth?: boolean;
}

const AppRoutes: IRoute[] = [
  {
    path: "/",
    index: true,
    Component: HomePage,
    requiresAuth: true,
  },

  {
    path: "/feature",
    Component: FeaturePage,
    requiresAuth: true,
  },
  {
    path: "/dashboard",
    Component: DashboardPage,
    requiresAuth: true,
  },
  {
    path: "/container-demo",
    Component: ContainerDemoPage,
    requiresAuth: true,
  },
  {
    path: "/visualizer",
    Component: VisualizerLayout,
    requiresAuth: true,
    children: [
      {
        index: true,
        Component: MedicalRAGPage,
      },
      {
        path: "webview",
        Component: WebDocsViewerPage,
      },
    ],
  },
  {
    path: "/data-table",
    Component: DataTablePage,
    requiresAuth: true,
  },
  {
    path: "/appointments",
    Component: AppointmentsPage,
    requiresAuth: true,
  },
  {
    path: "/sources/viewer",
    Component: SourcesViewerLayout,
    requiresAuth: true,
    children: [
      {
        index: true,
        Component: WebDocsViewerPage,
      },
      {
        path: "web/:id?",
        Component: WebDocsViewerPage,
      },
      {
        path: "file/:id",
        Component: FileSourcesViewerPage,
      },
    ],
  },
];

export default AppRoutes;
