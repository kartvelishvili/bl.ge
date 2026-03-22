"use server";
import { revalidateTag } from "next/cache";
import { CreateApiType } from "@/lib/api/types/create-api.type";
import { baseFetch, generateUrl } from "@/lib/api/base/base-fetch";
import { UpdateApiType } from "@/lib/api/types/update-api.type";
import { UpsertApiType } from "@/lib/api/types/upsert-api.type";

export const createApi: CreateApiType = async <T, D>(
  url: string,
  body: T,
  subResource?: string,
) => {
  const response: Response = await baseFetch(
    generateUrl({ url, subResource }),
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );

  revalidateTag(url);
  return {
    body: (await response.json()) as D,
    status: response.status,
    ok: response.ok,
  };
};

export const updateApi: UpdateApiType = async <T>(
  id: number,
  body: T,
  url: string,
  subResource?: string,
) => {
  const response: Response = await baseFetch(
    generateUrl({ url, id, subResource }),
    {
      method: "PUT",
      body: JSON.stringify(body),
    },
  );

  revalidateTag(url);
  return {
    body: await response.json(),
    status: response.status,
    ok: response.ok,
  };
};

export const removeApi: (url: string, id: number) => Promise<unknown> = async (
  url: string,
  id: number,
) => {
  const response: Response = await baseFetch(generateUrl({ url, id }), {
    method: "DELETE",
  });

  revalidateTag(url);
  return await response.json();
};

export const upsertApi: UpsertApiType = async <T>(
  url: string,
  body: T,
  id?: number,
  subResource?: string,
) => {
  const method: "POST" | "PUT" = id ? "PUT" : "POST";
  const response: Response = await baseFetch(
    generateUrl({ url, id, subResource }),
    {
      method,
      body: JSON.stringify(body),
    },
  );

  revalidateTag(url);
  return {
    body: await response.json(),
    status: response.status,
    ok: response.ok,
  };
};
