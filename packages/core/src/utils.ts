export type MaybePromise<T> = T | Promise<T>;

/* eslint-disable @typescript-eslint/no-explicit-any */
export type StrictlyRecord<T> = T extends Record<string, any>
  ? T extends Array<any>
    ? never
    : T
  : never;
/* eslint-enable @typescript-eslint/no-explicit-any */
