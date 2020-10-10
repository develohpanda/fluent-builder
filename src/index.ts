/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-prototype-builtins */
type IsOptional<T> = undefined extends T ? true : false;

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
  ? (value?: T[K]) => FluentBuilder<T>
  : (value: T[K]) => FluentBuilder<T>;

interface Builder<T> {
  reset: () => FluentBuilder<T>;
  build: () => T;
}

export type FluentBuilder<T> = Builder<T> & Mutator<T>;

export const createBuilder = <T extends object>(
  schema: Schema<T>
): FluentBuilder<T> => {
  const internalSchema: InternalSchema<T> = {...schema};
  const mutator: Partial<Mutator<T>> = {};

  for (const key in internalSchema) {
    if (internalSchema.hasOwnProperty(key)) {
      mutator[key] = ((v: T[typeof key]) => {
        internalSchema[key] = () => v;

        return mutator as FluentBuilder<T>;
      }) as Mutate<T, typeof key>;
    }
  }

  const builder = mutator as FluentBuilder<T>;
  builder.build = () => fromSchema<T>(internalSchema);
  builder.reset = () => {
    for (const key in schema) {
      if (schema.hasOwnProperty(key)) {
        internalSchema[key] = schema[key];
      }
    }

    return builder;
  };

  return builder;
};
