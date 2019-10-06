import {cloneDeep} from 'lodash';
import { IsOptional} from 'prop-types';

type InitialType<T, P extends keyof T> = IsOptional<T[P]> extends true ? T[P] | undefined | null : T[P];

type MutatorFunction<T, P extends keyof T> = IsOptional<T[P]> extends true ? (value?: T[P]) => With<T> : (value: T[P]) => With<T>;

type With<T> = {
  [P in keyof T]-?: MutatorFunction<T, P>;
};

export class FluentBuilder<T extends object> {
  private readonly set: With<T>;
  private readonly initial: T;
  private internalInstance: T;

  constructor(initial: T) {
    this.initial = initial;
    this.internalInstance = initial;
    this.set = {} as any;

    for (const key in this.initial) {
      this.set[key] = ((v: T[typeof key] ) => {
        this.internalInstance[key] = v;
        
        return this.set;
      }) as MutatorFunction<T, typeof key>;
    }
  }

  public mutate = (func: (set: With<T>) => void): T => {
    func(this.set);

    return this.instance();
  };

  public instance = (): T => cloneDeep(this.internalInstance);

  public reset = (): T => {
    this.internalInstance = cloneDeep(this.initial);

    return this.instance();
  };
}

interface Product {
  title: number;
  description?: number;
}

new FluentBuilder<Product>({title:1,description:2}).mutate(set => set.title(2).description())