import _ from "lodash";

export enum FluseTypes {
  Fixture = "Fixture",
  FixtureFactory = "FixtureFactory",
  AsArg = "AsArg",
  Context = "Context",
}

export const FluseWrappedSymbol = Symbol.for("fluse");

// eslint-disable-next-line @typescript-eslint/ban-types
export function withFluseSymbol(obj: Function | Object, fluseType: FluseTypes) {
  if (_.isFunction(obj)) {
    obj.prototype[FluseWrappedSymbol] = fluseType;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (obj as any)[FluseWrappedSymbol] = fluseType;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFluseType(obj: Function | Object, fluseType: FluseTypes) {
  if (_.isFunction(obj)) {
    return obj.prototype[FluseWrappedSymbol] === fluseType;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (obj as any)[FluseWrappedSymbol] === fluseType;
}
