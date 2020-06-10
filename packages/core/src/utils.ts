import isNil from "lodash.isnil";

export type MaybePromise<T> = T | Promise<T>;

/* eslint-disable @typescript-eslint/no-explicit-any */
export type StrictlyRecord<T> = T extends Record<string, any>
  ? T extends Array<any>
    ? never
    : T
  : never;
/* eslint-enable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */
export function isDefined<T>(value: T | null | undefined): value is T {
  return !isNil(value);
}
/* eslint-enable @typescript-eslint/no-explicit-any */
