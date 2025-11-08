export const EMBEDDINGS_QUERY_KEYS = {
  create: (text: string) => ["embeddings", text],
};

export const RETRIEVER_QUERY_KEYS = {
  query: (embedding: number[]) => ["pinecone", "query", embedding],
};
