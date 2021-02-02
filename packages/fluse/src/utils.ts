import _ from "lodash";

export type MaybePromise<T> = T | Promise<T>;

export type UnwrapPromise<T> = T extends PromiseLike<infer U> ? U : T;

export type GetRequiredKeys<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

export type ExcludeKeysByValue<T, V> = {
  [K in keyof T]: T[K] extends V ? never : K;
}[keyof T];

export function isDefined<T>(value: T | null | undefined): value is T {
  return !_.isNil(value);
}

export function keysOf<T>(value: T) {
  return Object.keys(value) as (keyof T)[];
}
