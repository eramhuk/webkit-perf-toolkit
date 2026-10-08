/**
 * Traces layout invalidation events and builds a dependency graph
 * of elements that trigger relayout cascades.
 */
export class LayoutTracer {
  private invalidations: Array<{ element: string; timestamp: number; depth: number }> = [];
  private tracing = false;

  start(): void {
    this.invalidations = [];
    this.tracing = true;
  }

  recordInvalidation(element: string, depth: number): void {
    if (!this.tracing) return;
    this.invalidations.push({
      element,
      timestamp: performance.now(),
      depth,
    });
  }

  stop(): { count: number; maxDepth: number; hotElements: string[] } {
    this.tracing = false;
    const maxDepth = Math.max(0, ...this.invalidations.map((i) => i.depth));

    const frequency = new Map<string, number>();
    for (const inv of this.invalidations) {
      frequency.set(inv.element, (frequency.get(inv.element) ?? 0) + 1);
    }

    const hotElements = [...frequency.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([el]) => el);

    return {
      count: this.invalidations.length,
      maxDepth,
      hotElements,
    };
  }
}
