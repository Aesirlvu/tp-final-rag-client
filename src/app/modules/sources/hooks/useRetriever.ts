import { ClientRetrieverService } from "@/app/api/services/client.retriever.service";
import { JinaEmbeddingsService } from "@/app/api/services/embedding.service";
import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { ragLogger, logger } from "@/utils";
import type { PineconeNamespacesResponse } from "@/app/api/services/client.retriever.service";

export const useCreateEmbedding = () => {
  return useMutation({
    mutationFn: async (text: string) => {
      const startTime = Date.now();
      ragLogger.api.request("Jina", "POST", "/embeddings", {
        textLength: text.length,
      });

      try {
        const response = await JinaEmbeddingsService.createEmbedding({
          text: [text],
        });

        ragLogger.api.response(
          "Jina",
          "POST",
          "/embeddings",
          200,
          Date.now() - startTime
        );

        // Debug: log the full response
        console.log("Jina API Response:", response);
        console.log("Jina API Response.data:", response.data);

        const data = response.data as any;
        ragLogger.search.embedding(text, data?.data?.[0]?.embedding?.length);

        // Check if response has expected structure
        if (
          !data ||
          !data.data ||
          !Array.isArray(data.data) ||
          data.data.length === 0
        ) {
          throw new Error(
            `Invalid Jina response structure: ${JSON.stringify(data)}`
          );
        }

        return data.data[0].embedding;
      } catch (error) {
        ragLogger.api.error("Jina", "POST", "/embeddings", error);
        throw error;
      }
    },
  });
};

// --- Query para buscar en Pinecone usando el embedding ---
export const useQueryVectors = () => {
  return useMutation({
    mutationFn: async ({
      namespace,
      vector,
      topK = 5,
      filter,
    }: {
      namespace: string;
      vector: number[];
      topK?: number;
      filter?: Record<string, any>;
      matches?: Record<string, any>[];
    }) => {
      const startTime = Date.now();
      ragLogger.api.request("Pinecone", "POST", "/query", {
        namespace,
        vectorLength: vector.length,
        topK,
        hasFilter: !!filter,
      });

      try {
        const response = await ClientRetrieverService.queryIndex(
          namespace,
          vector,
          topK,
          filter,
          false
        );

        ragLogger.api.response(
          "Pinecone",
          "POST",
          "/query",
          200,
          Date.now() - startTime
        );
        ragLogger.search.vectorSearch(namespace, vector.length, topK);

        return response.data;
      } catch (error) {
        ragLogger.api.error("Pinecone", "POST", "/query", error);
        throw error;
      }
    },
  });
};

export const useListNamespaces = () => {
  return useQuery({
    queryKey: ["namespaces"],
    queryFn: async () => {
      const startTime = Date.now();
      ragLogger.api.request("Pinecone", "GET", "/namespaces");

      try {
        const response = await ClientRetrieverService.listNamespaces();

        ragLogger.api.response(
          "Pinecone",
          "GET",
          "/namespaces",
          200,
          Date.now() - startTime
        );
        const data = response.data as PineconeNamespacesResponse;
        logger.debug(`Namespaces loaded: ${data.namespaces.length}`);

        return data.namespaces.map((ns) => ns.name);
      } catch (error) {
        ragLogger.api.error("Pinecone", "GET", "/namespaces", error);
        throw error;
      }
    },
  });
};

export const useDescribeNamespace = (namespace: string) => {
  return useQuery({
    queryKey: ["namespace", namespace],
    queryFn: () => ClientRetrieverService.describeNamespace(namespace),
    enabled: !!namespace,
  });
};

export const useSemanticSearch = (namespace: string) => {
  const createEmbedding = useCreateEmbedding();
  const queryVectors = useQueryVectors();

  const search = async (
    query: string,
    topK = 5,
    filter?: Record<string, any>
  ) => {
    // Paso 1: Crear embedding de la query
    const embedding = await createEmbedding.mutateAsync(query);

    // Paso 2: Buscar en Pinecone con el embedding
    const results = await queryVectors.mutateAsync({
      namespace,
      vector: embedding,
      topK,
      filter,
    });

    return results;
  };

  return {
    search,
    isEmbedding: createEmbedding.isPending,
    isSearching: queryVectors.isPending,
    isLoading: createEmbedding.isPending || queryVectors.isPending,
    error: createEmbedding.error || queryVectors.error,
  };
};

// Hook para obtener todos los vectores de todos los namespaces para visualización 3D
export const useAllVectorsFor3D = (selectedNamespace?: string) => {
  return useQuery({
    queryKey: ["all-vectors-3d", selectedNamespace],
    queryFn: async () => {
      const startTime = Date.now();
      logger.debug(
        `Starting fetch of sample vectors for 3D visualization${
          selectedNamespace
            ? ` (namespace: ${selectedNamespace})`
            : " (all namespaces)"
        }`
      );

      try {
        // 1. Obtener todos los namespaces o usar el seleccionado
        let namespaces: string[];
        if (selectedNamespace) {
          namespaces = [selectedNamespace];
        } else {
          const namespacesResponse =
            await ClientRetrieverService.listNamespaces();
          const namespacesData =
            namespacesResponse.data as PineconeNamespacesResponse;
          namespaces = namespacesData.namespaces.map((ns) => ns.name);
        }

        // Limitar a máximo 3 namespaces para evitar sobrecarga
        const maxNamespaces = 3;
        const namespacesToProcess = namespaces.slice(0, maxNamespaces);

        logger.debug(
          `Limited to ${namespacesToProcess.length} namespaces (from ${namespaces.length} total)`
        );

        let allVectors: number[][] = [];
        let totalSampledVectors = 0;
        const maxVectorsPerNamespace = selectedNamespace ? 50 : 10; // Más vectores si es un namespace específico

        // 2. Para cada namespace, obtener vectores usando queryIndex (igual que SemanticSearch)
        for (const namespace of namespacesToProcess) {
          logger.debug(`Processing namespace: ${namespace}`);

          try {
            // Usar queryIndex con un vector dummy para obtener vectores reales
            // Esto funciona mejor que listVectors + fetchVectors para evitar problemas CORS
            logger.debug(
              `Querying ${maxVectorsPerNamespace} vectors from namespace: ${namespace}`
            );
            const queryStartTime = Date.now();

            // Crear un vector dummy de ceros (1024 dimensiones para Jina embeddings)
            const dummyVector = new Array(1024).fill(0);

            const queryResponse = await ClientRetrieverService.queryIndex(
              namespace,
              dummyVector,
              maxVectorsPerNamespace,
              undefined,
              true // includeValues = true para obtener los vectores completos
            );

            logger.debug(
              `Query completed for ${namespace} in ${
                Date.now() - queryStartTime
              }ms`
            );

            const queryData = queryResponse.data as any;
            logger.debug(`Query response for ${namespace}:`, {
              hasMatches: !!queryData.matches,
              matchesCount: queryData.matches?.length || 0,
            });

            if (!queryData.matches || queryData.matches.length === 0) {
              logger.debug(`No vectors found in namespace ${namespace}`);
              continue;
            }

            // Extraer los valores de los vectores de los matches
            const vectors = queryData.matches
              .filter((match: any) => match.values && match.values.length > 0)
              .map((match: any) => match.values);

            allVectors.push(...vectors);
            totalSampledVectors += vectors.length;

            logger.debug(
              `Namespace ${namespace}: sampled ${vectors.length} vectors`
            );
          } catch (error) {
            logger.error(
              `Error fetching vectors for namespace ${namespace}`,
              error
            );
            // Continue with other namespaces instead of failing completely
          }
        }

        ragLogger.performance.timing("fetch_sample_vectors", startTime);
        logger.debug(`Total sampled vectors collected: ${totalSampledVectors}`);

        return {
          vectors: allVectors,
          totalSampledVectors,
          namespacesCount: namespacesToProcess.length,
          maxVectorsPerNamespace,
          selectedNamespace,
        };
      } catch (error) {
        logger.error("Error in useAllVectorsFor3D", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (antes cacheTime)
    retry: 1, // Solo reintentar una vez
    retryDelay: 2000, // Esperar 2 segundos antes de reintentar
  });
};

// Utilidad para delay entre requests
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Hook paginado para obtener vectores en chunks usando list() + fetch()
export const useAllVectorsFor3DPaginated = (selectedNamespace?: string) => {
  return useInfiniteQuery({
    queryKey: ["all-vectors-3d-paginated", selectedNamespace],
    queryFn: async ({ pageParam }) => {
      const startTime = Date.now();
      const LIST_LIMIT = 100; // IDs por página
      const REQUEST_DELAY_MS = 300;

      logger.debug(
        `📊 Fetching page with cursor: ${pageParam?.cursor || "initial"}`
      );

      // Delay estratégico
      if (pageParam?.cursor) {
        await sleep(REQUEST_DELAY_MS);
      }

      try {
        // 1. Obtener namespaces
        let namespaces: string[];
        if (selectedNamespace) {
          namespaces = [selectedNamespace];
        } else {
          const namespacesResponse =
            await ClientRetrieverService.listNamespaces();
          const namespacesData =
            namespacesResponse.data as PineconeNamespacesResponse;
          namespaces = namespacesData.namespaces.map((ns) => ns.name);
        }

        // Rotar entre namespaces si hay múltiples
        const currentNamespaceIndex = pageParam?.namespaceIndex || 0;
        const namespace = namespaces[currentNamespaceIndex];

        logger.debug(`🔍 Listing vectors from namespace: ${namespace}`);

        // 2. Listar IDs de vectores con paginación
        const listResponse = await ClientRetrieverService.listVectors(
          namespace,
          LIST_LIMIT,
          pageParam?.cursor || undefined
        );

        const listData = listResponse.data as any;

        if (!listData.vectors || listData.vectors.length === 0) {
          // Si no hay más vectores en este namespace, pasar al siguiente
          const nextNamespaceIndex = currentNamespaceIndex + 1;

          if (nextNamespaceIndex < namespaces.length) {
            logger.debug(
              `✅ Moving to next namespace: ${namespaces[nextNamespaceIndex]}`
            );
            return {
              vectors: [],
              totalSampledVectors: 0,
              hasMore: true,
              nextCursor: null,
              nextNamespaceIndex,
              namespace,
              namespacesCount: namespaces.length,
            };
          } else {
            logger.debug(`🏁 No more namespaces to process`);
            return {
              vectors: [],
              totalSampledVectors: 0,
              hasMore: false,
              nextCursor: null,
              nextNamespaceIndex: currentNamespaceIndex,
              namespace,
              namespacesCount: namespaces.length,
            };
          }
        }

        // 3. Extraer IDs
        const vectorIds = listData.vectors.map((v: any) => v.id);
        logger.debug(`📝 Got ${vectorIds.length} vector IDs`);

        // 4. Fetch los vectores completos con valores
        const fetchResponse = await ClientRetrieverService.fetchVectors(
          namespace,
          vectorIds
        );

        const fetchData = fetchResponse.data as any;

        // 5. Extraer valores de los vectores
        const vectors: number[][] = [];
        if (fetchData.vectors) {
          for (const vectorId of vectorIds) {
            const vectorData = fetchData.vectors[vectorId];
            if (vectorData?.values && Array.isArray(vectorData.values)) {
              vectors.push(vectorData.values);
            }
          }
        }

        ragLogger.performance.timing(`fetch_vectors_with_cursor`, startTime);
        logger.debug(
          `✅ Fetched ${vectors.length} complete vectors from ${namespace}`
        );

        // 6. Determinar si hay más páginas
        const nextCursor = listData.pagination?.next;
        const hasMoreInNamespace = !!nextCursor;
        const nextNamespaceIndex = !hasMoreInNamespace
          ? currentNamespaceIndex + 1
          : currentNamespaceIndex;
        const hasMore =
          hasMoreInNamespace || nextNamespaceIndex < namespaces.length;

        return {
          vectors,
          totalSampledVectors: vectors.length,
          hasMore,
          nextCursor: hasMoreInNamespace ? nextCursor : null,
          nextNamespaceIndex,
          namespace,
          namespacesCount: namespaces.length,
        };
      } catch (error) {
        logger.error(`❌ Error fetching vectors`, error);
        throw error;
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.hasMore) {
        return {
          cursor: lastPage.nextCursor,
          namespaceIndex: lastPage.nextNamespaceIndex,
        };
      }
      return undefined;
    },
    initialPageParam: { cursor: null, namespaceIndex: 0 } as {
      cursor: string | null;
      namespaceIndex: number;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    maxPages: 50, // Máximo 50 páginas para evitar too many requests
  });
};
