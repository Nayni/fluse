---
id: define-fixture
title: Define a fixture
sidebar_label: Define a fixture
---

A primary building block of Fluse is a fixture definition. It defines how to create one or more of your domain models. Creating such a definition is done by using the `fixture` function retrieved after [initializing](./initialize.md) Fluse.

```typescript
export const userFixture = fixture<User>({
  create(context) {
    const user = new User({
      firstName: context.faker.name.firstName(),
      lastName: context.faker.name.lastName(),
      phone: context.faker.phone.phoneNumber(),
      country: context.faker.address.countryCode(),
      email: context.faker.internet.email(),
    });

    return user;
  },
});
```

The above example shows a fixture definition for a user entity. The `create` method must be implemented and receives three arguments for you to work with:

- a `context` object, this context is related to which [plugins](./plugin-introoduction.md) you configured Fluse with,
- additional [arguments](./supplying-arguments.md) you may want to receive,
- an `info` object containing information regarding [lists](./making-lists.md),

:::note
We highly advice to keep your fixture definitions small, Fluse provides you a [combine api](./combining-fixtures.md) that allows you to create larger and complex data sets.
:::

Now that you have a fixture definition, it can be [executed](./execute.md).
