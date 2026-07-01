export abstract class Entity<TId> {
  protected constructor(protected readonly _id: TId) {}

  get id(): TId {
    return this._id;
  }

  equals(other?: Entity<TId> | null): boolean {
    if (other === undefined || other === null) {
      return false;
    }
    if (other.constructor !== this.constructor) {
      return false;
    }
    return this._id === other._id;
  }
}
