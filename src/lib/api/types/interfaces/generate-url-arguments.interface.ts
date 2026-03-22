import { QueriesType } from "@/lib/api/types/interfaces/query-params.interface";

export interface GenerateUrlArguments<T> {
  id?: number;
  subResource?: string;
  url: string;
  queryParameters?: QueriesType<T>;
}
