import _ from "lodash";

export type MaybePromise<T> = T | Promise<T>;

/* eslint-disable @typescript-eslint/no-explicit-any */
export type StrictlyRecord<T> = T extends Record<string, any>
  ? T extends Array<any>
    ? never
    : T
  : never;
/* eslint-enable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/ban-types */
export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];
/* eslint-enable @typescript-eslint/ban-types */

export type Args<TArgs> = RequiredKeys<TArgs> extends never
  ? { args?: TArgs }
  : { args: TArgs };

/* eslint-disable @typescript-eslint/no-explicit-any */
export function isDefined<T>(value: T | null | undefined): value is T {
  return !_.isNil(value);
}
/* eslint-enable @typescript-eslint/no-explicit-any */
