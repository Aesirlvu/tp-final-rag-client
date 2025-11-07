import { TIME_UNITS } from "@/app/constants";
import type { ApiError } from "@/app/types";
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
  timeout: number = 10 * TIME_UNITS.seconds;
  withCredentials: boolean = true;

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
}
