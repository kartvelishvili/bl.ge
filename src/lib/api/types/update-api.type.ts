import {ResponseInterface} from "@/lib/api/types/interfaces/response.interface";

export type UpdateApiType = <T>(
  id: number,
  body: T,
  url: string,
  subResource?: string,
) => Promise<ResponseInterface<T>>;
