/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from "lodash";
import semver from "semver";
import { ExcludeKeysByValue, isDefined, MaybePromise } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require("../package.json");

export const EMPTY_CONTEXT = Symbol.for("FLUSE_EMPTY_CONTEXT");
export const EMPTY_OPTIONS = Symbol.for("FLUSE_EMPTY_OPTIONS");

export type EmptyContext = typeof EMPTY_CONTEXT;
export type EmptyOptions = typeof EMPTY_OPTIONS;

export type FixtureResolver<TContext, TResult = any> = (
  context: TContext
) => Promise<TResult>;

export type PluginMiddlewareNextFn<
  TContext,
  TResult = any
> = TContext extends EmptyContext
  ? () => Promise<TResult>
  : (context: TContext) => Promise<TResult>;

export type PluginMiddlewareFn<
  TContext,
  TOptions,
  TResult = any
> = TOptions extends EmptyOptions
  ? (next: PluginMiddlewareNextFn<TContext, TResult>) => Promise<TResult>
  : (
      next: PluginMiddlewareNextFn<TContext, TResult>,
      options: TOptions
    ) => Promise<TResult>;

export type PluginContextFactory<TContext = any> = () => MaybePromise<TContext>;

export interface Plugin<TContext, TOptions> {
  name: string;
  version: string;
  execute: PluginMiddlewareFn<TContext, TOptions>;
}

export interface PluginDefinition<TContext, TOptions> {
  name: string;
  version: string;
  execute: PluginMiddlewareFn<TContext, TOptions>;
}

export type PluginConfig = Record<string, Plugin<any, any>>;

export type PluginContextMap<TPluginConfig extends PluginConfig> = {
  [K in keyof TPluginConfig]: Parameters<
    Parameters<TPluginConfig[K]["execute"]>[0]
  >[0];
};

export type FixtureContext<TPluginConfig extends PluginConfig> = {
  [K in ExcludeKeysByValue<
    PluginContextMap<TPluginConfig>,
    undefined
  >]: PluginContextMap<TPluginConfig>[K];
};

export type PluginOptionsMap<TPluginConfig extends PluginConfig> = {
  [K in keyof TPluginConfig]: Parameters<TPluginConfig[K]["execute"]>[1];
};

export type FixtureOptions<TPluginConfig extends PluginConfig> = {
  [K in ExcludeKeysByValue<
    PluginOptionsMap<TPluginConfig>,
    undefined
  >]?: PluginOptionsMap<TPluginConfig>[K];
};

export function createPlugin<TContext, TOptions = EmptyOptions>(
  definition: PluginDefinition<TContext, TOptions>
): Plugin<TContext, TOptions> {
  return definition;
}

export function validatePlugins(plugins: PluginConfig) {
  _.forEach(plugins, (plugin, key) => {
    if (!semver.satisfies(packageJson.version, plugin.version)) {
      throw new Error(
        `Plugin version (${plugin.version}) of '${plugin.name}' (${key}) is not compatible with this version (${packageJson.version}) of fluse.`
      );
    }
  });
}

export function composeMiddlewares<TContext>(
  plugins: PluginConfig,
  pluginOptions: FixtureOptions<PluginConfig>,
  resolver: FixtureResolver<TContext, any>
): FixtureResolver<TContext, any> {
  let lastResolver = resolver;
  for (const key of Object.keys(plugins).reverse()) {
    const plugin = plugins[key];
    const options = pluginOptions[key];

    const currentNext = plugin.execute;
    const previousNext = lastResolver;
    lastResolver = (rootContext) => {
      return currentNext((pluginContext) => {
        if (isDefined(pluginContext)) {
          (rootContext as any)[key] = pluginContext;
        }

        return previousNext(rootContext);
      }, options);
    };
  }

  return lastResolver;
}
