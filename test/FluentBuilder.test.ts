import {FluentBuilder, BuilderProxyType} from '../src/index';

interface Product {
  str: string;
  strOpt?: string;
  num: number;
  numOpt?: number;
  callback(): number;
  callbackOpt?(): number;
}

const defaultProduct: BuilderProxyType<Product> = {
  str: 'orgTitle',
  strOpt: undefined,
  num: 1,
  numOpt: null,
  callback: jest.fn(),
  callbackOpt: jest.fn()
};

const builder = new FluentBuilder<Product>(defaultProduct);

describe('FluentBuilder', () => {
  beforeEach(() => {
    builder.reset();
  });

  it('should mutate then reset', () => {
    const original = builder.instance();
    const mutated = builder.mutate(set => {
      set.;
    });
    const reset = builder.reset();

    // tslint:disable-next-line: no-console
    console.log(`
        Original: ${JSON.stringify(original)}
        Mutated : ${JSON.stringify(mutated)}
        Reset   : ${JSON.stringify(reset)}
    `);
  });
});
