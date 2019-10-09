import {IsOptional} from 'prop-types';

export type Entry<T> = () => T;

export type Schema<T> = Readonly<InternalSchema<T>>;

type InternalSchema<T> = {
  [K in keyof T]-?: Entry<T[K]>;
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

export const init = <T>(value: T): Entry<T> => () => value;

export class FluentBuilder<T extends object> {
  private readonly mutator: Mutator<T>;
  private readonly schema: Schema<T>;
  private internalSchema: InternalSchema<T>;

  public constructor(schema: Schema<T>) {
    this.schema = schema;
    this.internalSchema = {...schema};
    this.mutator = {} as any;

    for (const key in this.internalSchema) {
      if (this.internalSchema.hasOwnProperty(key)) {
        this.mutator[key] = ((v: T[typeof key]) => {
          this.internalSchema[key] = init(v);

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
    this.internalSchema = {...this.schema};

    return this;
  };

  public instance = (): T => fromSchema<T>(this.internalSchema);
}

export const createBuilder = <T extends object>(
  schema: Schema<T>
): FluentBuilder<T> => new FluentBuilder<T>(schema);
