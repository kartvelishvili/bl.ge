import { GetDataArgumentsInterface } from "@/lib/api/types/interfaces/get-data-arguments.interface";
import { baseFetch, generateUrl } from "@/lib/api/base/base-fetch";

export async function get<T>(
  data: GetDataArgumentsInterface<T>,
): Promise<T> {
  const { url, subResource, queryParameters, id } = data;
    const response: Response = await baseFetch(
    generateUrl({ url, id, subResource, queryParameters }),
    {
      method: "GET",
      next: {
        tags: [url],
      },
    },
  );

  if (!response.ok) {
    return [] as unknown as T;
  }

  return await response.json();
}
