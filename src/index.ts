import {cloneDeep} from 'lodash';
import {IsOptional} from 'prop-types';

type OptionalType<T> = IsOptional<T> extends true ? T | null : T;

export type OptionalToNullType<T> = {
  [K in keyof T]-?: OptionalType<T[K]>;
};

const unproxify = <T>(obj: OptionalToNullType<T>): T => {
  const result: T = {} as any;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = cloneDeep(obj[key] as T[typeof key]);
    }
  }

  return result;
};

type MutatorFunction<T, K extends keyof T> = IsOptional<T[K]> extends true
  ? (value?: T[K]) => Mutator<T>
  : (value: T[K]) => Mutator<T>;

type Mutator<T> = {
  [K in keyof T]-?: MutatorFunction<T, K>;
};

export class FluentBuilder<T extends object> {
  private readonly mutator: Mutator<T>;
  private readonly initial: T;
  private internalInstance: T;

  public constructor(initial: OptionalToNullType<T>) {
    this.initial = unproxify<T>(initial);
    this.internalInstance = unproxify<T>(initial);
    this.mutator = {} as any;

    for (const key in this.initial) {
      if (this.initial.hasOwnProperty(key)) {
        this.mutator[key] = ((v: T[typeof key]) => {
          this.internalInstance[key] = v;

          return this.mutator;
        }) as MutatorFunction<T, typeof key>;
      }
    }
  }

  public mutate = (func: (mutate: Mutator<T>) => void): T => {
    func(this.mutator);

    return this.instance();
  };

  public instance = (): T => cloneDeep(this.internalInstance);

  public reset = (): T => {
    this.internalInstance = cloneDeep(this.initial);

    return this.instance();
  };
}
