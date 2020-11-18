---
id: api-fixture
title: fixture()
sidebar_label: fixture()
---

Creates a fixture definition.

## Signature

```
fixture<TResult, TArgs>(config: {
  create: (
    context: { [key: string]: PluginContext },
    args: TArgs,
    info: {
      list: {
        index: number,
        size: number
      }
    }
  ) => MaybePromise<TResult>;
}) => FixtureFactory<TResult, TArgs>
```

- `create` **(required)**: A function that defines how to create a data model. This functions receives the following arguments:
  - `context`: The context as defined by [fluse()](./api-fluse.md),
  - `args`: Additional [arguments](./supplying-arguments.md) as defined by the `TArgs` type,
  - `info`: Additional info such as [list information](./making-lists.md)

## Example

```typescript
interface PostArgs {
  author: User;
}

export const postFixture = fixture<Post, PostArgs>({
  create(context, args) {
    const post = new Post({
      title: context.faker.lorem.slug(),
      body: context.faker.lorem.paragraphs(4),
      author: args.author,
    });

    return post;
  },
});
```
