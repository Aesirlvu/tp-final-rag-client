import { ClientAPI } from "../client/client.api";

const tasks = {
  retrieval: {
    query: "retrieval.query",
  },
};

export interface EmbeddingRequest {
  text: string[];
  task?: string;
  model?: string;
  dimensions?: number;
}

type JinaEmbeddingItem = {
  index: number;
  object: string;
  embedding: number[];
  text?: string;
};

export type JinaEmbeddingResponse = {
  model: string;
  data: JinaEmbeddingItem[];
  usage?: {
    total_tokens: number;
  };
};

export class JinaEmbeddingsService {
  static client: ClientAPI = ClientAPI.createInstance("https://api.jina.ai");

  constructor(client: ClientAPI) {
    JinaEmbeddingsService.client = client;
  }

  static async createEmbedding({ text }: EmbeddingRequest): Promise<any> {
    return this.client.requestBuilder({
      method: "POST",
      path: "https://api.jina.ai/v1/embeddings",
      body: {
        model: "jina-embeddings-v4",
        task: tasks.retrieval.query,
        dimensions: 1024,
        input: text,
      },
    });
  }
}
