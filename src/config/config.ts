import { IApiConfig } from "@/config/interfaces/api-config.interface";

export const apiConfig: IApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api',
};
