import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useListNamespaces, useSemanticSearch } from "./hooks/useRetriever";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { AlertCircle, Loader2, Search } from "lucide-react";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { Select, SelectContent } from "@/app/components/ui/select";
import { ragLogger, logger } from "@/utils";
import React from "react";

interface SearchResult {
  id: string;
  score: number;
  metadata?: Record<string, any>;
}

const SemanticSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [selectedNamespace, setSelectedNamespace] = useState("");
  const [topK, setTopK] = useState(5);
  const [results, setResults] = useState<SearchResult[]>([]);

  const { data: namespaces, isLoading: loadingNamespaces } =
    useListNamespaces();

  // Debug logging for namespaces
  React.useEffect(() => {
    if (namespaces) {
      logger.debug("Namespaces loaded", {
        count: namespaces.length,
        namespaces,
      });
      console.log("Namespaces data:", namespaces);
    }
  }, [namespaces]);
  const { search, isLoading, error } = useSemanticSearch(selectedNamespace);

  const handleSearch = async () => {
    if (!query.trim() || !selectedNamespace) {
      ragLogger.ui.searchConfig({
        namespace: selectedNamespace,
        topK,
        query: query.trim(),
      });
      return;
    }

    const startTime = Date.now();
    ragLogger.search.start(query, selectedNamespace, topK);

    try {
      const searchResults = await search(query, topK);
      const data = searchResults as { matches?: any[] };

      ragLogger.performance.timing("semantic_search", startTime);
      ragLogger.search.results(
        query,
        data.matches?.length || 0,
        data.matches?.[0]?.score
      );

      setResults(data.matches || []);
      ragLogger.ui.resultsDisplayed(data.matches?.length || 0);
    } catch (err) {
      ragLogger.search.error(query, err);
      console.error("Error en búsqueda:", err);
    }
  };

  const handleNamespaceChange = (namespace: string) => {
    setSelectedNamespace(namespace);
    if (namespace) {
      ragLogger.ui.namespaceSelected(namespace);
    }
  };

  const handleTopKChange = (value: number) => {
    setTopK(value);
    ragLogger.ui.searchConfig({
      namespace: selectedNamespace,
      topK: value,
      query,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Búsqueda Semántica</h1>
        <p className="text-muted-foreground">
          Busca contenido usando embeddings de Jina AI y Pinecone
        </p>
      </div>

      {/* Search Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
          <CardDescription>
            Selecciona el namespace y configura tu búsqueda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Namespace Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Namespace</label>
            <Select
              value={selectedNamespace}
              onValueChange={handleNamespaceChange}
              disabled={loadingNamespaces}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un namespace" />
              </SelectTrigger>
              <SelectContent>
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

          {/* Top K Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Resultados (Top K: {topK})
            </label>
            <Input
              type="number"
              min={1}
              max={20}
              value={topK}
              onChange={(e) => handleTopKChange(Number(e.target.value))}
            />
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Query</label>
            <div className="flex gap-2">
              <Input
                placeholder="Escribe tu búsqueda..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading || !selectedNamespace}
              />
              <Button
                onClick={handleSearch}
                disabled={isLoading || !query.trim() || !selectedNamespace}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span className="ml-2">Buscar</span>
              </Button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error instanceof Error
                  ? error.message
                  : "Error al realizar la búsqueda"}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="text-muted-foreground">
                Procesando búsqueda semántica...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {!isLoading && results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
            <CardDescription>
              Se encontraron {results.length} coincidencias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, index) => (
              <div key={result.id}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <span className="font-mono text-sm text-muted-foreground">
                        {result.id}
                      </span>
                    </div>
                    <Badge
                      variant={result.score > 0.8 ? "default" : "secondary"}
                    >
                      Score: {result.score.toFixed(4)}
                    </Badge>
                  </div>

                  {result.metadata && (
                    <div className="rounded-lg bg-muted p-3 space-y-1">
                      {Object.entries(result.metadata).map(([key, value]) => (
                        <div key={key} className="flex gap-2 text-sm">
                          <span className="font-medium">{key}:</span>
                          <span className="text-muted-foreground">
                            {typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {index < results.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {!isLoading && results.length === 0 && query && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No se encontraron resultados para "{query}"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SemanticSearch;
