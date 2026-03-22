import {ResponseInterface} from "@/lib/api/types/interfaces/response.interface";

export type CreateApiType = <T, D>(
  url: string,
  body: T,
  subResource?: string,
) => Promise<ResponseInterface<D>>;
