import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import DataTable from "react-data-table-component";
import { Line, LineChart, ResponsiveContainer } from "recharts";

export interface PlayerData extends Record<string, unknown> {
  PlayerID: number;
  PlayerName: string;
  PlayerImage: string;
  Team: string;
  TeamImage: string;
  Country: string;
  CountryImage: string;
  Position: string;
  Goals: number;
  Apps: number;
  PerformanceData: number[];
}

// Datos de ejemplo (vacío para template)
const playerSummary: PlayerData[] = [];

const gamePerformance: { PlayerID: number; PerformanceData: number[] }[] = [];

// Combinar datos
const combinedData: PlayerData[] = playerSummary.map((player) => {
  const performance = gamePerformance.find(
    (p) => p.PlayerID === player.PlayerID
  );
  return {
    ...player,
    PerformanceData: performance ? performance.PerformanceData : [],
  };
});

// Definición de columnas
const columns = [
  {
    name: "Player Name",
    selector: (row: PlayerData) => row.PlayerName,
    sortable: true,
  },
  {
    name: "Image",
    selector: (row: PlayerData) => row.PlayerImage,
    cell: (row: PlayerData) => (
      <img
        src={row.PlayerImage}
        alt={row.PlayerName}
        style={{ width: 50, height: 50 }}
      />
    ),
  },
  {
    name: "Goals",
    selector: (row: PlayerData) => row.Goals,
    sortable: true,
  },
  {
    name: "Performance Chart",
    cell: (row: PlayerData) => {
      const arrayData =
        gamePerformance.find((p) => p.PlayerID === row.PlayerID)
          ?.PerformanceData || [];
      return (
        <ResponsiveContainer width={100} height={40}>
          <LineChart data={arrayData.map((value, index) => ({ index, value }))}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    },
  },
];

// Estilos condicionales
const conditionalRowStyles = [
  {
    when: (row: PlayerData) => row.Goals > 20,
    classNames: ["bg-yellow-100", "dark:bg-yellow-900", "hover:cursor-pointer"],
  },
];

const DataTablePage = () => {
  const handleRowClicked = (row: PlayerData) => {
    console.log(row.PlayerName);
  };
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Table Example</CardTitle>
          <CardDescription>
            Tabla interactiva con tema personalizado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable<PlayerData>
            title="Data table"
            columns={columns}
            data={combinedData}
            pagination
            paginationPerPage={5}
            onRowClicked={handleRowClicked}
            conditionalRowStyles={conditionalRowStyles}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DataTablePage;
