---
id: create-plugin
title: How to create a plugin
sidebar_label: How to create a plugin
---

Creating a plugin starts by importing the `createPlugin` function from Fluse.

This function is a generic TypeScript function that requires two generic arguments to be passed:

- a type for the plugins context shape, this represents what your plugin will add to the context. In case your plugin doesn't add anything to the context you can use the `EmptyContext` type which is exported by Fluse.
- a type for runtime options that your plugin may use. These runtime options can be used to alter behaviour at runtime. They're mainly used for stateful resources such as database connections.

```typescript
import { createPlugin } from "fluse";

// Defines what we will put on the context.
// Don't forget to export this type!
export interface MyPluginContext {
  foo: string;
  baz: number;
}

// Defines what we will accept as runtime options.
// Don't forget to export this type!
export interface MyPluginOptions {
  printHello?: boolean;
}

// The plugin
function myPlugin() {
  return createPlugin<MyPluginContext, MyPluginOptions>({
    // Every plugin requires a name.
    // Fluse will use this to report possible issues back to you.
    name: "myplugin",
    // Plugins must specific a semver compatible range.
    version: "0.x",
    // Execute is the method you must implement as a plugin.
    // You'll receieve a next function as well as runtimeOptions (in case you typed them)
    execute(next, runtimeOptions) {
      if (runtimeOptions.printHello) {
        console.log("hello");
      }

      // You must call the next function, and provide your context.
      // Fluse will take care of the rest.
      return next({
        foo: "bar",
        baz: 1,
      });
    },
  });
}

export default myPlugin;
```

Once we have our plugin, we can use it by setting it up in the initialize:

```typescript
import { fluse } from "fluse";

export const { fixture, scenario } = fluse({
  plugins: {
    myplugin: myPlugin(),
  },
});
```

Fixture definitions will now contain a key `myplugin` which contains the plugins context. Additionally runtime options are now available on the execute method:

```typescript
const user = await userFixture().execute({
  myplugin: { printHello: true },
});
```

:::tip
If your plugin will be published as a separate npm package you should include Fluse as a `peerDependency`.
:::
