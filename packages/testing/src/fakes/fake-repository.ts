import type { Repository } from "@tec-platform/core";

export class FakeRepository<TEntity, TId> implements Repository<TEntity, TId> {
  private readonly store = new Map<string, TEntity>();

  constructor(private readonly keySelector: (entity: TEntity) => TId) {}

  async findById(id: TId): Promise<TEntity | null> {
    return this.store.get(this.serializeKey(id)) ?? null;
  }

  async save(entity: TEntity): Promise<void> {
    const key = this.serializeKey(this.keySelector(entity));
    this.store.set(key, entity);
  }

  async delete(id: TId): Promise<void> {
    this.store.delete(this.serializeKey(id));
  }

  clear(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }

  private serializeKey(id: TId): string {
    if (typeof id === "string") {
      return id;
    }

    return JSON.stringify(id);
  }
}
