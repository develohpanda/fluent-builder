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
  ? (value?: T[K]) => Builder<T>
  : (value: T[K]) => Builder<T>;

interface Operator<T> {
  reset: () => Builder<T>;
  build: () => T;
}

type Builder<T> = Mutator<T> & Operator<T>;

export const createBuilder = <T extends object>(
  schema: Schema<T>
): Builder<T> => {
  const internalSchema: InternalSchema<T> = {...schema};
  const mutator: Partial<Mutator<T>> = {};

  for (const key in internalSchema) {
    if (internalSchema.hasOwnProperty(key)) {
      mutator[key] = ((v: T[typeof key]) => {
        internalSchema[key] = () => v;

        return mutator as Builder<T>;
      }) as Mutate<T, typeof key>;
    }
  }

  const builder = mutator as Builder<T>;
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
