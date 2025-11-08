import { TIME_UNITS } from "@/app/constants";
import type { ApiError, ApiResponse, RequestBuilderProps } from "@/app/types";
import type {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosInstance,
} from "axios";
import axios, { AxiosError } from "axios";
import { logoutAndRedirect } from "@/lib/authActions";

export class ClientAPI {
  private static instance: ClientAPI;
  private client: AxiosInstance;

  baseUrl: string;
  timeout: number = 30 * TIME_UNITS.seconds;
  withCredentials: boolean = false;

  private constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.client = this.createClient();
  }

  public static getInstance(baseUrl: string): ClientAPI {
    if (!ClientAPI.instance) {
      ClientAPI.instance = new ClientAPI(baseUrl);
    }
    return ClientAPI.instance;
  }

  public static createInstance(baseUrl: string): ClientAPI {
    return new ClientAPI(baseUrl);
  }

  private createClient(): AxiosInstance {
    const client = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      withCredentials: this.withCredentials,
      headers: {
        "Content-Type": "application/json",
      },
    });

    client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // const token = useAuthStore.getState().accessToken;
        // if (token) config.headers.Authorization = `Bearer ${token}`;

        // Add headers for external APIs
        if (config.url?.includes("jina.ai")) {
          config.headers.Authorization = `Bearer ${"jina_0cd8533ca81944a095b2f2b38c4d89ednX9i7bHn6YPC9LRLTVmdrL1PXxdT"}`;
        } else if (config.url?.includes("pinecone.io")) {
          config.headers["Api-Key"] =
            "pcsk_5CeAP5_8KXxQVAjv713K71R3qjYqgXABgJ3QuFRyAkhaQ7tNHLZ2cxuqj2P65xWWXZRPgq";
          config.headers["X-Pinecone-API-Version"] = "2025-04";
        }

        return config;
      },
      (error: AxiosError) => Promise.reject(this.normalizeError(error))
    );

    client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        const normalizedError = this.normalizeError(error);

        if (error.response?.status === 401) {
          logoutAndRedirect();
        }

        return Promise.reject(normalizedError);
      }
    );
    return client;
  }

  private normalizeError(error: AxiosError): ApiError {
    interface ApiErrorData {
      message?: string;
    }
    return {
      message:
        (error.response?.data as ApiErrorData)?.message ||
        error.message ||
        "Error desconocido",
      status: error.response?.status ?? error.code,
      data: error.response?.data,
      originalError: error,
    };
  }

  get http(): AxiosInstance {
    return this.client;
  }

  private apiResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
      message: response.statusText,
    };
  }

  async requestBuilder<T>({
    method,
    path,
    id,
    body,
    params,
  }: RequestBuilderProps): Promise<ApiResponse<T>> {
    const isExternal = path.startsWith("http");

    let url: string;
    if (isExternal) {
      url = path;
    } else {
      let serviceUrl = `/${path}`;
      if (path) {
        serviceUrl += path;
      }
      url = id ? `${serviceUrl}/${id}` : serviceUrl;
    }

    if (!url) {
      throw new Error("URL no válida para la solicitud");
    }

    const response = await this.client.request<T>({
      method,
      url,
      ...(method === "POST" || method === "PUT" || method === "PATCH"
        ? { data: body }
        : {}),
      params,
    });

    return this.apiResponse<T>(response);
  }
}
