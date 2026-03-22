import { QueriesType } from "@/lib/api/types/interfaces/query-params.interface";

export interface GetDataArgumentsInterface<T> {
  url: string;
  id?: number;
  queryParameters?: QueriesType<T>;
  subResource?: string;
}
