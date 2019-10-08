# 🥨 fluent-builder 
[![npm version](https://badge.fury.io/js/%40develohpanda%2Ffluent-builder.svg)](https://badge.fury.io/js/%40develohpanda%2Ffluent-builder) [![CircleCI](https://circleci.com/gh/develohpanda/fluent-builder.svg?style=svg)](https://circleci.com/gh/develohpanda/fluent-builder)

### Generate a fluent, typed object builder for any interface or type.

`fluent-builder` consumes a seeding schema, and generates a `mutator` with a signature identical to the type being built, but with `mutate` functions, to make iterative modifications to your object.

```ts
createBuilder<Person>(schema).mutate(set => set.name('Bob').age(42)).instance();
```

## Why?

`fluent-builder` aims to simplify the use of the [builder pattern](https://sourcemaking.com/design_patterns/builder) for Typescript, using generics. This pattern allows for iterative construction of complex, often nested objects. Typically, a unique builder class needs to be implemented for each unique interface or type, to ensure correct typing is available.

## Installation

The usual

```
yarn add -D @develohpanda/fluent-builder

npm i --save-dev @develohpanda/fluent-builder
```

## Usage

#### Define your interface / type
```ts
interface Product {
  name: string;
  price: number;
  color?: string;
  buy: () => void;
}
```

#### Define a schema

```ts
import {Schema, init} from '@develohpanda/fluent-builder';

const schema: Schema<Product> = {
  name: init('Shirt'),
  price: init(2),
  color: init(undefined),
  buy: init(jest.fn()),
}
```

#### Create a builder
```ts
import {createBuilder} from '@develohpanda/fluent-builder';

const builder = createBuilder(schema);
```

#### Consume
```ts
describe('suite', () => {
  beforeEach(() => builder.reset());

  it('test', () => {
    builder.mutate(set =>
      set
        .price(4)
        .buy(jest.fn(() => console.log('here lol 1234')))
    );

    const instance = builder.instance();

    // use instance
  });
});
```

### Gotcha!

In order for types to be detected correctly in VS Code (eg. IntelliSense on hover), any file using `fluent-builder` should be included in the default project `tsconfig` to be compiled. If you know how to fix this, please submit a PR! :)

## Contributing

Please raise issues or feature requests via the [Github issue tracker](https://github.com/develohpanda/fluent-builder/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc).

Feel free to submit a pull request with your change!

```
yarn install
yarn test
```

## License

[MIT](LICENSE)
