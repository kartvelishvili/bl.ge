type ElementType<T> = T extends (infer U)[] ? U : T;

export type QueriesType<T> =
  | {
      [key in keyof ElementType<T>]: string;
    }
  | (keyof ElementType<T>)[]
  | {
      [key: string]: string | number | boolean;
    }
  | { limit: number; offset: number };
