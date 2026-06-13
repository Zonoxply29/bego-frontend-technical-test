export interface ApiResponse<T> {
  status: number;
  result: T;
  message?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("Falta configurar VITE_API_BASE_URL en el archivo .env");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const data = (await response.json()) as ApiResponse<T>;

  if (data.status >= 400) {
    throw new Error(data.message || `Error de API: ${data.status}`);
  }

  return data.result;
}