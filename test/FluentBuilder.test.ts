import {FluentBuilder, OptionalToNullType} from '../src/index';

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
