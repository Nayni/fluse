# An example of Fluse using the TypeORM plugin

This example showcases the usage of Fluse using the TypeORM plugin.

By providing the TypeORM plugin you'll have access to your connection and entity manager from TypeORM. This allows you to not just create fixture data objects but also store them in a database.

The examples use a `sqlite` database to demonstrate the possibilities.

Run the example with:

```
yarn start
```

## About these examples

The official examples from Fluse are written in the form of tests. You will find the domain model in `src/model` and the fixtures are defined in `src/fixtures.ts`. The tests show a few examples of how you can use Fluse to create basic and more advanced test data.

> **IMPORTANT**: The examples are part of the mono repo workspace. In order to run them successfully you'll have to clone the entire repository to ensure `node_modules` are hoisted correctly.
