export enum FluseTypes {
  Fixture = "Fixture",
  ScenarioComposer = "ScenarioComposer",
  Context = "Context",
}

export const FluseWrappedSymbol = Symbol.for("fluse");

export function withFluseSymbol(obj: unknown, fluseType: FluseTypes) {
  (obj as { [K in typeof FluseWrappedSymbol]: FluseTypes })[
    FluseWrappedSymbol
  ] = fluseType;
}

export function isFluseType(obj: unknown, fluseType: FluseTypes) {
  return (
    (obj as { [K in typeof FluseWrappedSymbol]: FluseTypes })[
      FluseWrappedSymbol
    ] === fluseType
  );
}
