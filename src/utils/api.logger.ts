export const logger = {
  error: (message: string, error?: any, context?: Record<string, any>) => {
    const logData = {
      message,
      error,
      context,
      timestamp: new Date().toISOString(),
    };
    if (import.meta.env.DEV) {
      console.error("[API Error]", logData);
    } else {
      // TODO: Enviar a servicio de logging (e.g., Sentry, LogRocket)
      // sendToLoggingService(logData);
    }
  },
  info: (message: string, context?: Record<string, any>) => {
    const logData = { message, context, timestamp: new Date().toISOString() };
    if (import.meta.env.DEV) {
      console.info("[API Info]", logData);
    }
  },
  warn: (message: string, context?: Record<string, any>) => {
    const logData = { message, context, timestamp: new Date().toISOString() };
    if (import.meta.env.DEV) {
      console.warn("[API Warn]", logData);
    }
  },
  debug: (message: string, context?: Record<string, any>) => {
    const logData = { message, context, timestamp: new Date().toISOString() };
    if (import.meta.env.DEV) {
      console.debug("[API Debug]", logData);
    }
  },
};

// Logger específico para búsqueda semántica y RAG
export const ragLogger = {
  search: {
    start: (query: string, namespace: string, topK: number) => {
      logger.debug("🔍 Iniciando búsqueda semántica", {
        query,
        namespace,
        topK,
        timestamp: new Date().toISOString(),
      });
    },
    embedding: (query: string, embeddingLength?: number) => {
      logger.debug("🧠 Generando embedding para query", {
        query,
        embeddingLength,
        timestamp: new Date().toISOString(),
      });
    },
    vectorSearch: (namespace: string, vectorLength: number, topK: number) => {
      logger.debug("🔎 Ejecutando búsqueda vectorial en Pinecone", {
        namespace,
        vectorLength,
        topK,
        timestamp: new Date().toISOString(),
      });
    },
    results: (query: string, resultCount: number, topScore?: number) => {
      logger.debug("✅ Búsqueda completada", {
        query,
        resultCount,
        topScore,
        timestamp: new Date().toISOString(),
      });
    },
    error: (query: string, error: any) => {
      logger.error("❌ Error en búsqueda semántica", error, {
        query,
        timestamp: new Date().toISOString(),
      });
    },
  },
  api: {
    request: (service: string, method: string, path: string, params?: any) => {
      logger.debug(`📡 ${service} API Request`, {
        method,
        path,
        params,
        timestamp: new Date().toISOString(),
      });
    },
    response: (
      service: string,
      method: string,
      path: string,
      status: number,
      duration: number
    ) => {
      logger.debug(`📥 ${service} API Response`, {
        method,
        path,
        status,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
      });
    },
    error: (service: string, method: string, path: string, error: any) => {
      logger.error(`💥 ${service} API Error`, error, {
        method,
        path,
        timestamp: new Date().toISOString(),
      });
    },
  },
  ui: {
    namespaceSelected: (namespace: string) => {
      logger.debug("📁 Namespace seleccionado", {
        namespace,
        timestamp: new Date().toISOString(),
      });
    },
    searchConfig: (config: {
      namespace: string;
      topK: number;
      query: string;
    }) => {
      logger.debug("⚙️ Configuración de búsqueda actualizada", {
        ...config,
        timestamp: new Date().toISOString(),
      });
    },
    resultsDisplayed: (resultCount: number) => {
      logger.debug("📊 Resultados mostrados en UI", {
        resultCount,
        timestamp: new Date().toISOString(),
      });
    },
  },
  performance: {
    timing: (operation: string, startTime: number, endTime?: number) => {
      const duration = endTime ? endTime - startTime : Date.now() - startTime;
      logger.debug(`⏱️ Performance: ${operation}`, {
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
      });
    },
    memory: (operation: string, dataSize?: number) => {
      logger.debug(`💾 Memory usage: ${operation}`, {
        dataSize,
        timestamp: new Date().toISOString(),
      });
    },
  },
};

// Logger para operaciones médicas específicas
export const medicalLogger = {
  roleSwitch: (fromRole: string, toRole: string) => {
    logger.info("👨‍⚕️ Cambio de rol médico", {
      from: fromRole,
      to: toRole,
      timestamp: new Date().toISOString(),
    });
  },
  dataView: (role: string, viewType: string) => {
    logger.debug("📋 Vista de datos médica", {
      role,
      viewType,
      timestamp: new Date().toISOString(),
    });
  },
  clinicalQuery: (query: string, role: string) => {
    logger.info("🔬 Consulta clínica realizada", {
      query,
      role,
      timestamp: new Date().toISOString(),
    });
  },
};
