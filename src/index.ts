import {IsOptional} from 'prop-types';

export type Schema<T> = Readonly<InternalSchema<T>>;

type InternalSchema<T> = {
  [K in keyof T]-?: () => T[K];
};

const fromSchema = <T>(schema: Schema<T>): T => {
  const result: Partial<T> = {};

  for (const key in schema) {
    if (schema.hasOwnProperty(key)) {
      result[key] = schema[key]();
    }
  }

  return result as T;
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
  private internalSchema: InternalSchema<T>;

  public constructor(schema: Schema<T>) {
    this.schema = schema;
    this.internalSchema = {...schema};
    const mutator: Partial<Mutator<T>> = {};

    for (const key in this.internalSchema) {
      if (this.internalSchema.hasOwnProperty(key)) {
        mutator[key] = ((v: T[typeof key]) => {
          this.internalSchema[key] = () => v;

          return this.mutator;
        }) as Mutate<T, typeof key>;
      }
    }

    this.mutator = mutator as Mutator<T>;
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
