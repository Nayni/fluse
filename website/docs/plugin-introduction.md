---
id: plugin-introduction
title: Introduction
sidebar_label: Introduction
---

The first argument of the `create` function in a fixture definition is a `context` object.

This context is made up out of plugins, which can be configured when you [initialize](./initialize.md) Fluse.

The combination of context and plugins allow Fluse to hook into any library of choice and even gain access to stateful resources such as a database connection you may wish to use.

Have a look at some of our [official plugins](./plugin-faker.md) or read our guide on how to [create your own](./create-plugin)!
