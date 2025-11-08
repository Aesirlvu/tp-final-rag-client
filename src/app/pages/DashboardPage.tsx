import { useEffect } from "react";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import { useUiStore } from "@/stores/ui.store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";

// Interfaces
interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
}

interface Appointment {
  id: string;
  patientId: string;
  date: string;
  status: "pending" | "completed" | "cancelled";
  notes?: string;
}

interface Diagnosis {
  id: string;
  patientId: string;
  description: string;
  date: string;
}

interface Outcome {
  id: string;
  appointmentId: string;
  result: string;
  date: string;
}

// Hardcoded data for assistant (administrative)
const patients: Patient[] = [
  { id: "1", name: "Juan Pérez", age: 45, condition: "Hipertensión" },
  { id: "2", name: "María García", age: 32, condition: "Diabetes Tipo 2" },
  { id: "3", name: "Carlos Rodríguez", age: 58, condition: "Cardiopatía" },
  { id: "4", name: "Laura Martínez", age: 29, condition: "Asma" },
];

const appointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    date: "2025-11-10",
    status: "pending",
    notes: "Chequeo rutinario",
  },
  {
    id: "2",
    patientId: "2",
    date: "2025-11-12",
    status: "completed",
    notes: "Control glucemia",
  },
  {
    id: "3",
    patientId: "3",
    date: "2025-11-15",
    status: "pending",
    notes: "Evaluación cardíaca",
  },
  {
    id: "4",
    patientId: "4",
    date: "2025-11-18",
    status: "cancelled",
    notes: "Consulta respiratoria",
  },
];

// Hardcoded data for resident (clinical)
const diagnoses: Diagnosis[] = [
  {
    id: "1",
    patientId: "1",
    description: "Hipertensión esencial",
    date: "2025-11-05",
  },
  {
    id: "2",
    patientId: "2",
    description: "Diabetes mellitus tipo 2",
    date: "2025-11-07",
  },
  {
    id: "3",
    patientId: "3",
    description: "Insuficiencia cardíaca congestiva",
    date: "2025-11-08",
  },
];

const outcomes: Outcome[] = [
  {
    id: "1",
    appointmentId: "2",
    result: "Glucemia controlada",
    date: "2025-11-12",
  },
  {
    id: "2",
    appointmentId: "1",
    result: "Presión arterial elevada",
    date: "2025-11-10",
  },
];

const DashboardPage = () => {
  const { setBreadcrumbs } = useBreadcrumbs();
  const { mockUser } = useUiStore();

  useEffect(() => {
    setBreadcrumbs([{ label: "Dashboard" }]);
  }, [setBreadcrumbs]);

  const isAssistant = mockUser.role === "assistant";

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Médico</h1>
        <p className="text-muted-foreground">
          Bienvenido, {mockUser.name} ({mockUser.role})
        </p>
      </div>

      {isAssistant ? (
        // Vista del Asistente (Administrativa)
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Pacientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{patients.length}</div>
                <p className="text-xs text-muted-foreground">
                  Pacientes registrados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Turnos Pendientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {appointments.filter((a) => a.status === "pending").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Requieren atención
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Turnos Completados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {appointments.filter((a) => a.status === "completed").length}
                </div>
                <p className="text-xs text-muted-foreground">Este mes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Estado del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">Activo</Badge>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pacientes Recientes</CardTitle>
                <CardDescription>Últimos pacientes registrados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {patients.slice(0, 3).map((patient) => (
                    <div
                      key={patient.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {patient.age} años - {patient.condition}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Próximos Turnos</CardTitle>
                <CardDescription>Turnos programados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {appointments
                    .filter((a) => a.status === "pending")
                    .slice(0, 3)
                    .map((appt) => {
                      const patient = patients.find(
                        (p) => p.id === appt.patientId
                      );
                      return (
                        <div
                          key={appt.id}
                          className="flex justify-between items-center"
                        >
                          <div>
                            <p className="font-medium">{patient?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {appt.date} - {appt.notes}
                            </p>
                          </div>
                          <Badge variant="outline">{appt.status}</Badge>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        // Vista del Residente (Clínica)
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Diagnósticos Realizados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{diagnoses.length}</div>
                <p className="text-xs text-muted-foreground">Este mes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Resultados Registrados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{outcomes.length}</div>
                <p className="text-xs text-muted-foreground">
                  Consultas completadas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Pacientes Atendidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(diagnoses.map((d) => d.patientId)).size}
                </div>
                <p className="text-xs text-muted-foreground">
                  Pacientes únicos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Estado Clínico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">Activo</Badge>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Diagnósticos Recientes</CardTitle>
                <CardDescription>
                  Últimos diagnósticos formulados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {diagnoses.slice(0, 3).map((diag) => {
                    const patient = patients.find(
                      (p) => p.id === diag.patientId
                    );
                    return (
                      <div
                        key={diag.id}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{patient?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {diag.description}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {diag.date}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resultados de Consultas</CardTitle>
                <CardDescription>Resultados registrados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {outcomes.slice(0, 3).map((outcome) => {
                    const appt = appointments.find(
                      (a) => a.id === outcome.appointmentId
                    );
                    const patient = patients.find(
                      (p) => p.id === appt?.patientId
                    );
                    return (
                      <div
                        key={outcome.id}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{patient?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {outcome.result}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {outcome.date}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Progreso del Sistema Médico</CardTitle>
          <CardDescription>
            Estado actual del desarrollo de MEDICAL-RAG-PLATFORM
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Procesamiento de Documentos</span>
              <span>85%</span>
            </div>
            <Progress value={85} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Integración Genómica</span>
              <span>70%</span>
            </div>
            <Progress value={70} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Interfaz Clínica</span>
              <span>60%</span>
            </div>
            <Progress value={60} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
