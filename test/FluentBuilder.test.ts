import {createBuilder, init, Schema} from '../src/index';

interface First {
  str?: string;
  num: number;
  numOpt?: number;
  obj: Second;
  arr: Array<number>;
  func: () => void;
}

interface Second {
  val: number;
  valOpt?: number;
}

const str = 'str';
const num = 2;
const numOpt = undefined;
const obj: Second = {
  val: 3,
  valOpt: undefined,
};
const arr: Array<number> = [1];
const func = jest.fn();

const expectedInitial: First = {
  str,
  num,
  numOpt,
  obj,
  arr,
  func,
};

const schema: Schema<First> = {
  str: init(str),
  num: init(num),
  numOpt: init(numOpt),
  obj: init(obj),
  arr: init(arr),
  func: init(func),
};

describe('FluentBuilder', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should create initial instance from schema', () => {
    const instance = createBuilder(schema).instance();

    expect(instance).toEqual(expectedInitial);
  });

  it('should track complex properties by reference from schema initializer to instance', () => {
    const builder = createBuilder(schema);
    const before = builder.instance();

    expect(before.arr).toEqual(arr);
    expect(before.obj).toEqual(obj);

    arr.push(3);
    obj.valOpt = 2;

    const after = builder.instance();

    expect(after.arr).toEqual(arr);
    expect(after.obj).toEqual(obj);
  });

  it('should track jest function calls on the instance', () => {
    const instance = createBuilder(schema).instance();

    expect(instance.func).not.toHaveBeenCalled();

    instance.func();

    expect(instance.func).toHaveBeenCalled();
  });

  it('should track jest function calls between instances', () => {
    const builder = createBuilder(schema);
    expect(builder.instance().func).not.toHaveBeenCalled();
    builder.instance().func();
    expect(builder.instance().func).toHaveBeenCalled();
  });

  it('should track mutated function calls', () => {
    const mutatedFunc = jest.fn();

    const instance = createBuilder(schema)
      .mutate(s => s.func(mutatedFunc))
      .instance();

    expect(instance.func).not.toHaveBeenCalled();
    mutatedFunc();
    expect(instance.func).toHaveBeenCalled();
    expect(func).not.toHaveBeenCalled();
  });

  it('should reset back to initial', () => {
    const builder = createBuilder(schema);

    const instance = builder
      .mutate(set => set.numOpt(5).str('test'))
      .instance();

    expect(instance).not.toEqual(expectedInitial);

    const resetInstance = builder.reset().instance();

    expect(resetInstance).toEqual(expectedInitial);
  });

  it('should define all mutator properties', () => {
    const builder = createBuilder(schema);

    builder.mutate(set => {
      for (const key in set) {
        expect((set as any)[key]).toBeDefined();
      }
    });
  });

  it('should mutate instance when calling corresponding mutator function', () => {
    const builder = createBuilder(schema);

    const str = 'test';
    const instance = builder.mutate(set => set.str(str)).instance();

    expect(instance.str).toEqual(str);
  });

  it.each([null, undefined, 1])(
    'should should allow optional parameter in mutator function: %o',
    (input: any) => {
      const builder = createBuilder(schema);

      const instance = builder.mutate(set => set.numOpt(input)).instance();

      expect(instance.numOpt).toEqual(input);
    }
  );
});
