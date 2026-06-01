import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { jwtDecode } from "jwt-decode";

export class ApiService {
  [x: string]: unknown;

  private static instance: ApiService;
  private api: AxiosInstance;
  private memoryToken: string | null = null;

  private constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      timeout: 10000,
    });

    this.memoryToken = localStorage.getItem("@AgendamentoToken");

    this.initializeInterceptors();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public async setToken(token: string | null): Promise<void> {
    this.memoryToken = token;
    if (token) {
      localStorage.setItem("@AgendamentoToken", token);
    } else {
      localStorage.removeItem("@AgendamentoToken");
    }
    return Promise.resolve();
  }

  public async getToken(): Promise<string | null> {
    if (!this.memoryToken) {
      this.memoryToken = localStorage.getItem("@AgendamentoToken");
    }
    return this.memoryToken;
  }

  public async getUsuarioLogadoId(): Promise<number | null> {
    const token = await this.getToken();
    if (!token) {
      return null;
    }

    try {
      const payload = jwtDecode<Record<string, unknown>>(token);
      const rawUserId = payload.userID ?? payload.userId ?? payload.sub;

      if (typeof rawUserId === "number") {
        return rawUserId;
      }

      if (typeof rawUserId === "string" && rawUserId.trim().length > 0) {
        const parsed = Number(rawUserId);
        if (!Number.isNaN(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Erro ao decodificar token JWT:", error);
    }

    return null;
  }

  private async initializeInterceptors(): Promise<void> {
    this.api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const response = await axios.get(
              `${this.api.defaults.baseURL}/Auth/refresh`,
              {
                withCredentials: true,
              },
            );
            const newToken = response.data.accessToken;

            await this.setToken(newToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            await this.setToken(null);
            window.location.href = "/";
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      },
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.api.get<T>(url, config);
    console.log(`\n\nresposta: ${res.data}\n`)
    return res.data;
  }

  public async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res = await this.api.post<T>(url, data, config);
    return res.data;
  }

  public async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res = await this.api.put<T>(url, data, config);
    return res.data;
  }

  public async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res = await this.api.patch<T>(url, data, config);
    return res.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.api.delete<T>(url, config);
    return res.data;
  }
}

export const api = ApiService.getInstance();
