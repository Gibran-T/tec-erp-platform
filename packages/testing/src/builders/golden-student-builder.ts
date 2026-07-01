export interface GoldenStudent {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
  readonly cohortCode: string;
  readonly productId: string;
}

export class GoldenStudentBuilder {
  private id = "golden-student-001";
  private email = "golden.student@tec.local";
  private displayName = "Golden Student";
  private cohortCode = "COHORT-FOUNDATION";
  private productId = "tec-erp";

  withId(id: string): this {
    this.id = id;
    return this;
  }

  withEmail(email: string): this {
    this.email = email;
    return this;
  }

  withDisplayName(displayName: string): this {
    this.displayName = displayName;
    return this;
  }

  withCohortCode(cohortCode: string): this {
    this.cohortCode = cohortCode;
    return this;
  }

  withProductId(productId: string): this {
    this.productId = productId;
    return this;
  }

  build(): GoldenStudent {
    return {
      id: this.id,
      email: this.email,
      displayName: this.displayName,
      cohortCode: this.cohortCode,
      productId: this.productId,
    };
  }
}

export function createGoldenStudent(overrides?: Partial<GoldenStudent>): GoldenStudent {
  const baseline = new GoldenStudentBuilder().build();

  return {
    ...baseline,
    ...overrides,
  };
}
