import {cloneDeep} from 'lodash';
import { IsOptional} from 'prop-types';

type OptionalType<T> = IsOptional<T> extends true ? T | undefined | null : T;

type InitialType<T> = {
  [K in keyof T]: OptionalType<T[K]>
}

type MutatorFunction<T, K extends keyof T> = IsOptional<T[K]> extends true ? (value?: T[K]) => Mutator<T> : (value: T[K]) => Mutator<T>;

type Mutator<T> = {
  [K in keyof T]-?: MutatorFunction<T, K>;
};

export class FluentBuilder<T extends object> {
  private readonly mutator: Mutator<T>;
  private readonly initial: InitialType<T>;
  private internalInstance: InitialType<T>;

  constructor(initial: InitialType<T>) {
    this.initial = initial;
    this.internalInstance = initial;
    this.mutator = {} as any;

    for (const key in this.initial) {
      this.mutator[key] = ((v: OptionalType<T[typeof key]> ) => {
        this.internalInstance[key] = v;
        
        return this.mutator;
      }) as MutatorFunction<T, typeof key>;
    }
  }

  public mutate = (func: (mutate: Mutator<T>) => void): T => {
    func(this.mutator);

    return this.instance();
  };

  public instance = (): T => {
    let result = {} as T;

    for (const key in this.internalInstance) {
      result[key] = this.internalInstance[key] as T[typeof key];
    }

    return result;
  };

  public reset = (): T => {
    this.internalInstance = cloneDeep(this.initial);

    return this.instance();
  };
}

interface Product {
  title: number;
  description?: number;
}

new FluentBuilder<Product>({title:1,description:2}).mutate(set => set.description().title())