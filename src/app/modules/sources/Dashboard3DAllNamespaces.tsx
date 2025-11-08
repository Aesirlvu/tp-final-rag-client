import { useEffect, useState, useMemo } from "react";
import Plot from "react-plotly.js";
import { PCA } from "ml-pca";
import {
  useAllVectorsFor3DPaginated,
  useListNamespaces,
} from "./hooks/useRetriever";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { logger } from "@/utils";

export default function Dashboard3DAllNamespaces() {
  const [vectors3D, setVectors3D] = useState<number[][]>([]);
  const [selectedNamespace, setSelectedNamespace] = useState<string>("all");
  const [plotKey, setPlotKey] = useState(0);

  const { data: namespaces, isLoading: loadingNamespaces } =
    useListNamespaces();
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isFetching, // Indica si HAY CUALQUIER fetch en progreso
  } = useAllVectorsFor3DPaginated(
    selectedNamespace === "all" ? undefined : selectedNamespace
  );

  // Combinar todos los vectores de todas las páginas usando useMemo para evitar recrear el array
  const allVectors = useMemo(() => {
    return data?.pages.flatMap((page) => page.vectors) || [];
  }, [data?.pages]);

  const totalVectors = allVectors.length;
  const totalNamespaces = data?.pages[0]?.namespacesCount || 0;

  // Memoizar los datos del plot para evitar recreación innecesaria
  const plotData = useMemo(() => {
    if (vectors3D.length === 0) return [];

    return [
      {
        x: vectors3D.map((v) => v[0]),
        y: vectors3D.map((v) => v[1]),
        z: vectors3D.map((v) => v[2]),
        type: "scatter3d",
        mode: "markers",
        marker: {
          size: 3,
          color: "blue",
          opacity: 0.7,
        },
      },
    ];
  }, [vectors3D]);

  // Procesar PCA solo cuando NO hay fetching activo y hay datos
  useEffect(() => {
    // Si está fetching, no hacer nada - esperar a que termine
    if (isFetching) {
      return;
    }

    // Solo procesar cuando el fetch está completo y hay vectores
    if (allVectors.length > 0) {
      try {
        logger.debug(
          `🔄 Applying PCA to ${allVectors.length} vectors (fetch completed)`
        );

        // Aplicar PCA 1024→3
        const pca = new PCA(allVectors);
        const reduced = pca.predict(allVectors, { nComponents: 3 }).to2DArray();

        setVectors3D(reduced);
        setPlotKey((prev) => prev + 1); // Incrementar key para forzar re-render del componente Plot
        logger.debug(
          `✅ PCA completed, reduced to ${reduced.length} 3D points`
        );
      } catch (pcaError) {
        logger.error("❌ Error applying PCA", pcaError);
      }
    } else if (!isFetching && allVectors.length === 0) {
      // Si no hay vectores y no está fetching, limpiar el gráfico
      setVectors3D([]);
      logger.debug("🧹 No vectors available, clearing plot");
    }
  }, [allVectors, isFetching]); // Dependencias: allVectors y isFetching

  if (isLoading) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-muted-foreground">
              Cargando muestra de vectores de todos los namespaces...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error al cargar los datos:{" "}
              {error instanceof Error ? error.message : "Error desconocido"}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>
          Visualización 3D{" "}
          {selectedNamespace !== "all"
            ? `- ${selectedNamespace}`
            : "- Todos los Namespaces"}
        </CardTitle>
        <CardDescription>
          PCA 3D de {totalVectors} vectores muestreados de {totalNamespaces}{" "}
          namespaces
          {isFetching && " - Cargando datos..."}
          {hasNextPage && !isFetching && " - Hay más datos disponibles"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Namespace Filter */}
        <div className="mb-4 space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                Filtrar por Namespace
              </label>
              <Select
                value={selectedNamespace}
                onValueChange={setSelectedNamespace}
                disabled={loadingNamespaces || isRefetching}
              >
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Selecciona un namespace" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los namespaces</SelectItem>
                  {Array.isArray(namespaces) &&
                    namespaces
                      .filter((ns) => typeof ns === "string")
                      .map((ns: string, index: number) => (
                        <SelectItem key={`${ns}-${index}`} value={ns}>
                          {ns}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>

            {/* Refresh Button */}
            <Button
              onClick={() => refetch()}
              disabled={isRefetching}
              variant="outline"
              size="icon"
              className="h-10 w-10"
              title="Refrescar datos"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
              />
            </Button>
          </div>

          {/* Load More Button */}
          {hasNextPage && !isFetching && (
            <div className="flex gap-2">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage || isRefetching}
                variant="outline"
                className="flex-1 max-w-xs"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Cargando...
                  </>
                ) : (
                  `Cargar 100 más (${totalVectors} actuales)`
                )}
              </Button>
              <Button
                onClick={() => {
                  // Cargar las próximas 5 páginas (500 vectores)
                  for (let i = 0; i < 5; i++) {
                    setTimeout(() => fetchNextPage(), i * 400); // 400ms entre cada página
                  }
                }}
                disabled={isFetchingNextPage || isRefetching}
                variant="default"
                className="whitespace-nowrap"
              >
                Cargar 500 más
              </Button>
            </div>
          )}

          {/* Progress indicator cuando está cargando */}
          {isFetching && (
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="font-medium">
                  Cargando datos ({totalVectors} vectores cargados)
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Los requests están espaciados para evitar límites de tasa
              </p>
            </div>
          )}
        </div>

        {/* Plot Area */}
        {isFetching && totalVectors === 0 ? (
          // Primera carga
          <div className="flex items-center justify-center h-[700px] text-muted-foreground">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p>Cargando vectores...</p>
            </div>
          </div>
        ) : isFetching ? (
          // Cargando más datos - mostrar gráfico actual con overlay
          <div className="relative w-full h-[700px]">
            {vectors3D.length > 0 && (
              <Plot
                key={plotKey}
                data={plotData as any}
                layout={
                  {
                    scene: {
                      xaxis: { title: "PC1" },
                      yaxis: { title: "PC2" },
                      zaxis: { title: "PC3" },
                      aspectmode: "cube",
                    },
                    margin: { l: 0, r: 0, t: 0, b: 0 },
                  } as any
                }
                config={{
                  displayModeBar: true,
                  displaylogo: false,
                  modeBarButtonsToRemove: ["toImage"],
                  responsive: true,
                }}
                style={{ width: "100%", height: "100%" }}
              />
            )}
            {/* Overlay de carga */}
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center pointer-events-none">
              <div className="bg-card p-4 rounded-lg shadow-lg border border-border">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <p className="text-sm font-medium">
                    Cargando más vectores... ({totalVectors} actuales)
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : vectors3D.length > 0 ? (
          // Datos completos - mostrar gráfico
          <div className="w-full h-[700px]">
            <Plot
              key={plotKey}
              data={plotData as any}
              layout={
                {
                  scene: {
                    xaxis: { title: "PC1" },
                    yaxis: { title: "PC2" },
                    zaxis: { title: "PC3" },
                    aspectmode: "cube",
                  },
                  margin: { l: 0, r: 0, t: 0, b: 0 },
                } as any
              }
              config={{
                displayModeBar: true,
                displaylogo: false,
                modeBarButtonsToRemove: ["toImage"],
                responsive: true,
              }}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        ) : (
          // Sin datos
          <div className="flex items-center justify-center h-[700px] text-muted-foreground">
            <div className="text-center space-y-2">
              <AlertCircle className="h-8 w-8 mx-auto opacity-50" />
              <p>No hay datos para visualizar</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
