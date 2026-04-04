export type TKeysOfType<O, T> = {
  [K in keyof O]: O[K] extends T ? K : never;
}[keyof O];
export type TsOverride<Type, NewType> = Omit<Type, keyof NewType> & NewType;
export type TsPickRequired<Type, Key extends keyof Type> = Type & Required<Pick<Type, Key>>;
export type TsPickStringLiteral<A, B extends A> = B;
export type TsAllToString<T> = {[P in keyof T]: string};
