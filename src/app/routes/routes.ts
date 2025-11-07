import {
  ContainerDemoPage,
  DashboardPage,
  DataTablePage,
  FeaturePage,
  HomePage,
  MedicalRAGPage,
} from "../pages";

export interface IRoute {
  path?: string;
  Component: React.LazyExoticComponent<React.FC> | React.FC;
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
    Component: MedicalRAGPage,
    requiresAuth: true,
  },
  {
    path: "/data-table",
    Component: DataTablePage,
    requiresAuth: true,
  },
];

export default AppRoutes;
