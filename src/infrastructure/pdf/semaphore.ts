export class Semaphore {
  private current = 0;
  private queue: Array<() => void> = [];

  constructor(private readonly limit: number) {}

  async run<T>(task: () => Promise<T>): Promise<T> {
    if (this.current >= this.limit) {
      await new Promise<void>(resolve => this.queue.push(resolve));
    }

    this.current += 1;
    try {
      return await task();
    } finally {
      this.current -= 1;
      const next = this.queue.shift();
      next?.();
    }
  }
}
