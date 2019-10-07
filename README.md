# fluent-builder 
[![npm version](https://badge.fury.io/js/fluent-builder.svg)](https://badge.fury.io/js/fluent-builder) [![CircleCI](https://circleci.com/gh/develohpanda/fluent-builder.svg?style=svg)](https://circleci.com/gh/develohpanda/fluent-builder)

### Generate a fluent, typed builder for any interface or type.

The basis of this library is to simplify the use of the [builder pattern](https://sourcemaking.com/design_patterns/builder) for Typescript, using generics. This pattern allows for simplified construction of complex, often nested objects. Typically, a unique builder class needs to be implemented for each unique interface or type, to ensure correct typing is available.

`fluent-builder` takes a seed object, and generates a `mutator` with an identical signature to the type being built, but as functions. This `mutator` allows you to change particular properties.

## Installation

`yarn add fluent-builder` or `npm i fluent-builder`

## Usage

This library has two exports:

- `FluentBuilder<T>` - the builder class to instantiate
- `OptionalToNullType<T>` - to convert the type signature of optional properties to required, nullable properties

The `FluentBuilder<T>` constructor requires a seed `T` object, but with _all properties populated_. This is achieved with the `OptionalToNullType<T>`. 

<details>
<summary>Explanation</code></summary>

As a side effect of types not existing at runtime, all unset optional properties on the seed object will not have a subsequent mutator function. 

The proxy type `OptionalToNullType<T>` will convert the type signature of optional properties from `{ num?: number }` to `{ num: number | null }`;
</details>

## Example

Usage in a unit test:

```ts
interface Product {
  name: string;
  quantity: number;
  color?: string;
  price?: number;
}

const defaultProduct: OptionalToNullType<Product> = {
  name: 'Shirt',
  quantity: 2,
  color: 'red',
  price: null,
};

const builder = new FluentBuilder<Product>(defaultProduct);

describe('suite', () => {
  beforeEach(() => builder.reset());

  it('test', () => {
    const instance = builder
      .mutate(set =>
        set
          .quantity(4)
          .color()
          .price(12)
      )
      .instance();

    // use instance in test
  });
});

```

### Gotcha!

In order for types to be detected correctly in VS Code (eg. on hover, intellisence), any file using `fluent-builder` should be included in the default project `tsconfig` to be compiled. If you know how to fix this, please submit a PR! :)

## Contributing

Please raise issues or feature requests via the [Github issue tracker](https://github.com/develohpanda/fluent-builder/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc)

Feel free to submit a pull request with your change!

```
yarn install
yarn test
```

## Wishlist:
- [ ] Improve handling of function properties to ensure callbacks are not cloned.

## License

[MIT](LICENSE)
