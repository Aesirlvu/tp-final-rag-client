import { ClientAPI } from "../client/client.api";

export interface PineconeNamespaceInfo {
  name: string;
  record_count: number;
}

export interface PineconeNamespacesResponse {
  namespaces: PineconeNamespaceInfo[];
}

export interface PineconeQueryMatch {
  id: string;
  score: number;
  values?: number[];
  sparseValues?: {
    indices: number[];
    values: number[];
  };
  metadata?: Record<string, any>;
}

export interface PineconeQueryResponse {
  results?: any[]; // deprecated
  matches: PineconeQueryMatch[];
  namespace: string;
  usage: {
    readUnits: number;
  };
}

export class ClientRetrieverService {
  private static host: string = import.meta.env.VITE_PINECONE_INDEX_HOST;
  private static client: ClientAPI = ClientAPI.createInstance(
    "https://api.pinecone.io"
  );

  static async listNamespaces<n>() {
    return this.client.requestBuilder({
      method: "GET",
      path: `${this.host}/namespaces`,
    });
  }

  // --- Describir un namespace específico ---
  static async describeNamespace(namespace: string) {
    return this.client.requestBuilder({
      method: "GET",
      path: `${this.host}/namespaces/${namespace}`,
    });
  }

  // --- Listar vectores de un namespace ---
  static async listVectors(namespace: string, params?: Record<string, any>) {
    return this.client.requestBuilder({
      method: "GET",
      path: `${this.host}/vectors/list`,
      params: { namespace, ...params },
    });
  }

  // --- Fetchear vectores específicos ---
  static async fetchVectors(namespace: string, ids: string[]) {
    // Construir query string manualmente: ids=id1&ids=id2&ids=id3
    const idsQuery = ids.map((id) => `ids=${encodeURIComponent(id)}`).join("&");
    const namespaceQuery = `namespace=${encodeURIComponent(namespace)}`;
    const queryString = `${idsQuery}&${namespaceQuery}`;

    return this.client.requestBuilder({
      method: "GET",
      path: `${this.host}/vectors/fetch?${queryString}`,
    });
  }

  static async queryIndex(
    namespace: string,
    vector: number[],
    topK = 5,
    filter?: Record<string, any>,
    includeValues = false
  ) {
    return this.client.requestBuilder({
      method: "POST",
      path: `${this.host}/query`,
      body: {
        namespace,
        vector,
        topK,
        filter,
        includeValues,
        includeMetadata: true,
      },
    });
  }
}
