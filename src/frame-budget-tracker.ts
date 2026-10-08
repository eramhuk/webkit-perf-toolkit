/**
 * Tracks per-frame time budgets to identify jank sources.
 * A frame that exceeds 16.67ms (at 60fps) is considered dropped.
 */
export interface FrameBudget {
  targetFps: number;
  budgetMs: number;
}

export interface JankReport {
  totalFrames: number;
  jankyFrames: number;
  jankPercentage: number;
  longestFrameMs: number;
  avgFrameMs: number;
}

export class FrameBudgetTracker {
  private frameTimes: number[] = [];
  private budget: FrameBudget;

  constructor(targetFps = 60) {
    this.budget = {
      targetFps,
      budgetMs: 1000 / targetFps,
    };
  }

  recordFrameTime(durationMs: number): void {
    this.frameTimes.push(durationMs);
  }

  isJanky(durationMs: number): boolean {
    return durationMs > this.budget.budgetMs;
  }

  getReport(): JankReport {
    const janky = this.frameTimes.filter((t) => t > this.budget.budgetMs);
    const total = this.frameTimes.length;
    const sum = this.frameTimes.reduce((a, b) => a + b, 0);

    return {
      totalFrames: total,
      jankyFrames: janky.length,
      jankPercentage: total > 0 ? (janky.length / total) * 100 : 0,
      longestFrameMs: Math.max(0, ...this.frameTimes),
      avgFrameMs: total > 0 ? sum / total : 0,
    };
  }

  reset(): void {
    this.frameTimes = [];
  }
}
