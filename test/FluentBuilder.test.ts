import {FluentBuilder, OptionalToNullType} from '../src/index';

interface First {
  str?: string;
  num: number;
  numOpt?: number;
  second: Second;
  arr: Array<Second>;
}

interface Second {
  num: number;
  numOpt?: number;
}

const getDefaultFirst = (): OptionalToNullType<First> => ({
  str: 'str',
  num: 2,
  numOpt: null,
  second: {
    num: 3,
  },
  arr: [],
});

describe('FluentBuilder - Initial Object', () => {
  it('should match initial and instance', () => {
    const defaultFirst = getDefaultFirst();
    const builder = new FluentBuilder<First>(defaultFirst);
    const instance = builder.instance();

    expect(instance).toEqual(defaultFirst);
  });

  it('should not update builder instance if input object is updated', () => {
    const defaultFirst = getDefaultFirst();
    const builder = new FluentBuilder<First>(defaultFirst);
    const before = builder.instance();

    defaultFirst.second.num = 3;
    defaultFirst.arr.push({num: 4});

    const after = builder.instance();

    expect(before).toEqual(after);
  });

  it('should not update builder instance if input array item is updated', () => {
    const defaultFirst = getDefaultFirst();
    const obj: Second = {num: 2};
    defaultFirst.arr.push(obj);

    const builder = new FluentBuilder<First>(defaultFirst);
    const before = builder.instance();

    obj.num = 3;

    const after = builder.instance();

    expect(before.arr).toEqual(after.arr);
  });
});

describe('FluentBuilder - Reset', () => {
  it('should reset back to initial', () => {
    const defaultFirst = getDefaultFirst();
    const builder = new FluentBuilder<First>(defaultFirst);

    const instance = builder
      .mutate(set => set.numOpt(5).str('test'))
      .instance();

    expect(instance).not.toEqual(defaultFirst);

    const resetInstance = builder.reset().instance();

    expect(resetInstance).toEqual(defaultFirst);
  });
});

describe('FluentBuilder - Mutator', () => {
  it('should define all mutator properties', () => {
    const defaultFirst = getDefaultFirst();
    const builder = new FluentBuilder<First>(defaultFirst);

    builder.mutate(set => {
      for (const key in set) {
        expect((set as any)[key]).toBeDefined();
      }
    });
  });

  it('should mutate instance when calling corresponding mutator function', () => {
    const defaultFirst = getDefaultFirst();
    const builder = new FluentBuilder<First>(defaultFirst);

    const str = 'test';
    const instance = builder.mutate(set => set.str(str)).instance();

    expect(instance.str).toEqual(str);
  });

  it.each([null, undefined, 1])(
    'should should allow optional parameter in mutator function: %o',
    (input: any) => {
      const defaultFirst = getDefaultFirst();
      const builder = new FluentBuilder<First>(defaultFirst);

      const instance = builder.mutate(set => set.numOpt(input)).instance();

      expect(instance.numOpt).toEqual(input);
    }
  );
});
