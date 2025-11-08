export { AUTH_QUERY_KEYS } from "./auth.keys";

const EMBEDDINGS_QUERY_KEYS = {
  create: (text: string[]) => ["embeddings", text],
};

const RETRIEVER_QUERY_KEYS = {
  query: (embedding: number[]) => ["pinecone", "query", embedding],
};
export { EMBEDDINGS_QUERY_KEYS, RETRIEVER_QUERY_KEYS };
