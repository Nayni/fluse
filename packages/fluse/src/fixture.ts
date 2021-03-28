import { FluseTypes, isFluseType, withFluseSymbol } from "./internal";
import { composeMiddlewares, PluginConfig } from "./plugin";
import { GetRequiredKeys, keysOf, MaybePromise } from "./utils";

export interface FixtureDefinitionCreateInfo {
  list: {
    index: number;
    size: number;
  };
}

export interface FixtureDefinitionConfig<TContext, TResult, TArgs> {
  create(
    context: TContext,
    args: TArgs,
    info: FixtureDefinitionCreateInfo
  ): MaybePromise<TResult>;
}

export type WrapArgs<T, TPluginOptions, IsRoot = true> = T extends
  | string
  | number
  | boolean
  | Date
  ? T | Fixture<T, TPluginOptions>
  :
      | T
      | (IsRoot extends true ? never : Fixture<T, TPluginOptions>)
      | {
          [K in keyof T]: WrapArgs<T[K], TPluginOptions, false>;
        };

export type FixtureDefinition<
  TResult,
  TArgs,
  TRuntimeOptions
> = GetRequiredKeys<TArgs> extends never
  ? (
      args?: WrapArgs<TArgs, TRuntimeOptions>
    ) => Fixture<TResult, TRuntimeOptions>
  : (
      args: WrapArgs<TArgs, TRuntimeOptions>
    ) => Fixture<TResult, TRuntimeOptions>;

export interface Fixture<TResult, TPluginOptions> {
  execute(options?: TPluginOptions): Promise<TResult>;
  list(size: number): Fixture<TResult[], TPluginOptions>;
}

export class FluseFixture<TContext, TResult, TArgs, TRuntimeOptions>
  implements Fixture<TResult, TRuntimeOptions> {
  constructor(
    protected plugins: PluginConfig,
    protected definition: FixtureDefinitionConfig<TContext, TResult, TArgs>,
    protected args?: TArgs
  ) {}

  execute = (options?: TRuntimeOptions): Promise<TResult> => {
    const context = this.createContext();
    const runtimeOptions = options ?? {};

    const resolve = composeMiddlewares<TContext>(
      this.plugins,
      runtimeOptions,
      (ctx) => {
        return this.resolve(ctx);
      }
    );

    return resolve(context);
  };

  resolve = async (context: TContext): Promise<TResult> => {
    const args = await this.unwrapArgs(context);
    const result = await this.definition.create(context, args, {
      list: { index: 0, size: 1 },
    });

    return result;
  };

  list = (size: number) => {
    const fixture = new FluseFixture<
      TContext,
      TResult[],
      TArgs,
      TRuntimeOptions
    >(this.plugins, toList(this.definition, this.unwrapArgs, size));

    withFluseSymbol(fixture, FluseTypes.Fixture);
    return fixture;
  };

  private createContext = (): TContext => {
    const ctx = {} as TContext;
    withFluseSymbol(ctx, FluseTypes.Context);
    return ctx;
  };

  private unwrapArgs = async (context: TContext) => {
    const originalArgs = this.args ?? ({} as TArgs);
    const unwrappedArgs: { [K in keyof TArgs]?: unknown } = {};

    for (const argKey of keysOf(originalArgs)) {
      const arg = originalArgs[argKey];

      if (isFluseFixture(arg)) {
        const unwrappedArg = await arg.resolve(context);
        unwrappedArgs[argKey] = unwrappedArg;
      } else {
        unwrappedArgs[argKey] = arg;
      }
    }

    return unwrappedArgs as TArgs;
  };
}

export function isFluseFixture(
  value: unknown
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): value is FluseFixture<any, any, any, any> {
  return (
    value instanceof FluseFixture && isFluseType(value, FluseTypes.Fixture)
  );
}

function toList<TContext, TResult, TArgs>(
  definition: FixtureDefinitionConfig<TContext, TResult, TArgs>,
  getArgs: (context: TContext) => Promise<TArgs>,
  size: number
): FixtureDefinitionConfig<TContext, TResult[], TArgs> {
  return {
    async create(context) {
      const results: TResult[] = [];

      for (let i = 0; i < size; i++) {
        const args = await getArgs(context);
        const res = await definition.create(context, args, {
          list: { index: i, size },
        });
        results.push(res);
      }

      return results;
    },
  };
}
