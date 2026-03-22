import * as qs from "qs";
import { BaseFetchType } from "@/lib/api/types/base-fetch.type";
import { GenerateUrlType } from "@/lib/api/types/generate-url.type";
import { GenerateUrlArguments } from "@/lib/api/types/interfaces/generate-url-arguments.interface";
import { apiConfig } from "@/config/config";

export const baseFetch: BaseFetchType = async (
  url: string,
  data: RequestInit,
) => {
  return await fetch(`${apiConfig.baseUrl}/${url}`, {
    ...data,
    headers: {
      ...data.headers,
      "Content-Type": "application/json",
    },
  });
};

export const generateUrl: GenerateUrlType = <T>(
  data: GenerateUrlArguments<T>,
): string => {
  const { url, subResource, id, queryParameters } = data;
  const urlWithId = `${url}${id ? `/${id}` : ""}${subResource ? `/${subResource}` : ""}`;

  if (queryParameters) {
    const queryString: string = qs.stringify(data.queryParameters, {
      arrayFormat: "comma",
      encode: false,
    });
    return `${urlWithId}?${queryString}`;
  }

  return urlWithId;
};
