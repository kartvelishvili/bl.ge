export type BaseFetchType = (
  url: string,
  data: RequestInit,
) => Promise<Response>;
