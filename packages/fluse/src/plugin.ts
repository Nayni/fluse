/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from "lodash";
import semver from "semver";
import { ExcludeKeysByValue, isDefined, MaybePromise } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require("../package.json");

const EMPTY_CONTEXT = Symbol.for("FLUSE_EMPTY_CONTEXT");

type EmptyContext = typeof EMPTY_CONTEXT;

export type FixtureResolver<TContext, TResult = any> = (
  context: TContext
) => Promise<TResult>;

export type PluginMiddlewareNextFn<
  TContext,
  TResult = any
> = TContext extends EmptyContext
  ? () => Promise<TResult>
  : (context: TContext) => Promise<TResult>;

export type PluginMiddlewareFn<TContext, TResult = any> = (
  next: PluginMiddlewareNextFn<TContext, TResult>
) => Promise<TResult>;

export type PluginContextFactory<TContext = any> = () => MaybePromise<TContext>;

export interface Plugin<TContext> {
  name: string;
  version: string;
  execute: PluginMiddlewareFn<TContext>;
}

export interface PluginDefinition<TContext> {
  name: string;
  version: string;
  execute: PluginMiddlewareFn<TContext>;
}

export type PluginConfig = Record<string, Plugin<any>>;

type RootContextMap<TPluginConfig extends PluginConfig> = {
  [K in keyof TPluginConfig]: Parameters<
    Parameters<TPluginConfig[K]["execute"]>[0]
  >[0];
};

export type RootContext<TPluginConfig extends PluginConfig> = {
  [K in ExcludeKeysByValue<
    RootContextMap<TPluginConfig>,
    undefined
  >]: RootContextMap<TPluginConfig>[K];
};

export function createPlugin<TContext = EmptyContext>(
  definition: PluginDefinition<TContext>
): Plugin<TContext> {
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
  resolver: FixtureResolver<TContext, any>
): FixtureResolver<TContext, any> {
  let lastResolver = resolver;
  for (const key of Object.keys(plugins).reverse()) {
    const plugin = plugins[key];

    const currentNext = plugin.execute;
    const previousNext = lastResolver;
    lastResolver = (rootContext) => {
      return currentNext((pluginContext) => {
        if (isDefined(pluginContext)) {
          (rootContext as any)[key] = pluginContext;
        }

        return previousNext(rootContext);
      });
    };
  }

  return lastResolver;
}
