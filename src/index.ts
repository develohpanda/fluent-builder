import {IsOptional} from 'prop-types';

export type Initial<T> = () => T;

export type Schema<T> = {
  +readonly [K in keyof T]-?: Initial<T[K]>;
};

const fromSchema = <T>(schema: Schema<T>): T => {
  const result: T = {} as any;

  for (const key in schema) {
    if (schema.hasOwnProperty(key)) {
      result[key] = schema[key]();
    }
  }

  return result;
};

type Mutator<T> = {
  [K in keyof T]-?: Mutate<T, K>;
};

type Mutate<T, K extends keyof T> = IsOptional<T[K]> extends true
  ? (value?: T[K]) => Mutator<T>
  : (value: T[K]) => Mutator<T>;

export class FluentBuilder<T extends object> {
  private readonly mutator: Mutator<T>;
  private readonly schema: Schema<T>;
  private internalInstance: T;

  public constructor(schema: Schema<T>) {
    this.schema = schema;
    this.internalInstance = fromSchema<T>(schema);
    this.mutator = {} as any;

    for (const key in this.internalInstance) {
      if (this.internalInstance.hasOwnProperty(key)) {
        this.mutator[key] = ((v: T[typeof key]) => {
          this.internalInstance[key] = v;

          return this.mutator;
        }) as Mutate<T, typeof key>;
      }
    }
  }

  public mutate = (func: (mutate: Mutator<T>) => void): FluentBuilder<T> => {
    func(this.mutator);

    return this;
  };

  public reset = (): FluentBuilder<T> => {
    this.internalInstance = fromSchema<T>(this.schema);

    return this;
  };

  public instance = (): T => this.internalInstance;
}

export const init = <T>(value: T): Initial<T> => () => value;

export const createBuilder = <T extends object>(
  schema: Schema<T>
): FluentBuilder<T> => new FluentBuilder<T>(schema);
