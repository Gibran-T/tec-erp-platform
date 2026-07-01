export interface Left<L> {
  readonly tag: "left";
  readonly value: L;
}

export interface Right<R> {
  readonly tag: "right";
  readonly value: R;
}

export type Either<L, R> = Left<L> | Right<R>;

export const Either = {
  left<L, R>(value: L): Either<L, R> {
    return { tag: "left", value };
  },

  right<L, R>(value: R): Either<L, R> {
    return { tag: "right", value };
  },

  isLeft<L, R>(either: Either<L, R>): either is Left<L> {
    return either.tag === "left";
  },

  isRight<L, R>(either: Either<L, R>): either is Right<R> {
    return either.tag === "right";
  },

  map<L, R, T>(either: Either<L, R>, fn: (value: R) => T): Either<L, T> {
    if (either.tag === "left") {
      return either;
    }
    return Either.right(fn(either.value));
  },

  mapLeft<L, R, T>(either: Either<L, R>, fn: (value: L) => T): Either<T, R> {
    if (either.tag === "right") {
      return either;
    }
    return Either.left(fn(either.value));
  },
};
