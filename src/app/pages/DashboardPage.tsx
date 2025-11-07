import { useEffect } from "react";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import DataTable from "../components/shared/DataTable";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import type { PlayerData } from "./DataTablePage";

const DashboardPage = () => {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Dashboard" }]);
  }, [setBreadcrumbs]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Vista general de tu aplicación</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +20.1% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">
              +180.1% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Actividad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              +19% desde la semana pasada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">Activo</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progreso del Proyecto</CardTitle>
          <CardDescription>Estado actual del desarrollo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Frontend</span>
              <span>85%</span>
            </div>
            <Progress value={85} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Backend</span>
              <span>60%</span>
            </div>
            <Progress value={60} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Testing</span>
              <span>40%</span>
            </div>
            <Progress value={40} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
