import {createBuilder, Schema} from '../src/index';

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
  str: () => str,
  num: () => num,
  numOpt: () => numOpt,
  obj: () => obj,
  arr: () => arr,
  func: () => func,
};

describe('FluentBuilder', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should create initial instance from schema', () => {
    const instance = createBuilder(schema).build();

    expect(instance).toEqual(expectedInitial);
  });

  it('should track complex properties by reference from schema initializer to instance', () => {
    const builder = createBuilder(schema);
    const before = builder.build();

    expect(before.arr).toBe(arr);
    expect(before.obj).toBe(obj);

    arr.push(3);
    obj.valOpt = 2;

    const after = builder.build();

    expect(after.arr).toBe(arr);
    expect(after.obj).toBe(obj);
  });

  it('can track jest function calls on the instance', () => {
    const instance = createBuilder(schema).build();

    expect(instance.func).not.toHaveBeenCalled();

    instance.func();

    expect(instance.func).toHaveBeenCalled();
  });

  it('can track jest function calls between instances', () => {
    const builder = createBuilder(schema);
    expect(builder.build().func).not.toHaveBeenCalled();
    builder.build().func();
    expect(builder.build().func).toHaveBeenCalled();
  });

  it('can track mutated function calls', () => {
    const mutatedFunc = jest.fn();

    const instance = createBuilder(schema)
      .func(mutatedFunc)
      .build();

    expect(instance.func).not.toHaveBeenCalled();
    mutatedFunc();
    expect(instance.func).toHaveBeenCalled();
    expect(func).not.toHaveBeenCalled();
  });

  it('can reset back to initial', () => {
    const builder = createBuilder(schema);

    const instance = builder
      .numOpt(5)
      .str('test')
      .build();

    expect(instance).not.toEqual(expectedInitial);

    const resetInstance = builder.reset().build();

    expect(resetInstance).toEqual(expectedInitial);
  });

  it('can reset and mutate freely', () => {
    const builder = createBuilder(schema);

    let numOpt = 1;
    let str = 'test 1';
    const func = jest.fn();

    const instance = builder
      .numOpt(numOpt)
      .str(str)
      .func(func)
      .build();

    expect(instance.numOpt).toEqual(numOpt);
    expect(instance.str).toEqual(str);
    expect(instance.func).toBe(func);

    const resetInstance = builder.reset().build();
    expect(resetInstance).toEqual(expectedInitial);

    numOpt = 3;
    str = 'test';
    const rebuiltInstance = builder
      .numOpt(numOpt)
      .str(str)
      .build();

    expect(rebuiltInstance.numOpt).toEqual(numOpt);
    expect(rebuiltInstance.str).toEqual(str);
    expect(rebuiltInstance.func).toBe(expectedInitial.func);
    expect(rebuiltInstance.func).not.toBe(func);
  });

  it('should define all mutator properties', () => {
    const builder = createBuilder(schema);

    for (const key in builder) {
      expect((builder as any)[key]).toBeDefined();
    }
  });

  it('should not update a previous instance if the builder is mutated afterards', () => {
    const builder = createBuilder(schema);
    const before = builder.build();

    expect(before.num).toEqual(num);

    const updatedNum = num + 1;
    builder.num(updatedNum);

    const after = builder.build();

    expect(before.num).toEqual(num);
    expect(after.num).toEqual(updatedNum);
  });

  it('can mutate an optional property that was initialized as undefined', () => {
    const builder = createBuilder(schema);

    expect(builder.build().numOpt).toBeUndefined();

    const update = 1;
    builder.numOpt(update);

    expect(builder.build().numOpt).toEqual(update);
  });

  it('should show mutation on instance after mutator function', () => {
    const builder = createBuilder(schema);

    const str = 'test';
    const instance = builder.str(str).build();

    expect(instance.str).toEqual(str);
  });

  it.each([null, undefined, 1])(
    'should allow optional parameter in mutator function: %o',
    (input: any) => {
      const builder = createBuilder(schema);

      const instance = builder.numOpt(input).build();

      expect(instance.numOpt).toEqual(input);
    }
  );
});
