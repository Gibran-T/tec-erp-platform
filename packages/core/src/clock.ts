export interface Clock {
  now(): Date;
}

class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}

class FixedClock implements Clock {
  constructor(private readonly fixed: Date) {}

  now(): Date {
    return new Date(this.fixed.getTime());
  }
}

let activeClock: Clock = new SystemClock();

export const Clock = {
  system(): Clock {
    return new SystemClock();
  },

  fixed(date: Date): Clock {
    return new FixedClock(date);
  },

  use(clock: Clock): void {
    activeClock = clock;
  },

  now(): Date {
    return activeClock.now();
  },

  reset(): void {
    activeClock = new SystemClock();
  },
};
