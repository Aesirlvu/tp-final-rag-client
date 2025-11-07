import type { AxiosError } from "axios";

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message: string;
}

export interface ApiError {
  message: string;
  status?: number | string;
  data?: unknown;
  originalError?: AxiosError;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
