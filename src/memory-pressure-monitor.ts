/**
 * Monitors memory pressure signals from the WebKit process,
 * tracking JS heap growth, DOM node counts, and triggering
 * warnings when thresholds are exceeded.
 */
export interface MemorySnapshot {
  timestamp: number;
  jsHeapSizeBytes: number;
  domNodeCount: number;
  detachedNodeCount: number;
  eventListenerCount: number;
}

export interface MemoryThresholds {
  maxJsHeapMB: number;
  maxDomNodes: number;
  maxDetachedNodes: number;
}

const DEFAULT_THRESHOLDS: MemoryThresholds = {
  maxJsHeapMB: 256,
  maxDomNodes: 50_000,
  maxDetachedNodes: 500,
};

export class MemoryPressureMonitor {
  private snapshots: MemorySnapshot[] = [];
  private thresholds: MemoryThresholds;

  constructor(thresholds?: Partial<MemoryThresholds>) {
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };
  }

  record(snapshot: MemorySnapshot): void {
    this.snapshots.push(snapshot);
  }

  getWarnings(): string[] {
    if (this.snapshots.length === 0) return [];
    const latest = this.snapshots[this.snapshots.length - 1];
    const warnings: string[] = [];

    const heapMB = latest.jsHeapSizeBytes / (1024 * 1024);
    if (heapMB > this.thresholds.maxJsHeapMB) {
      warnings.push(`JS heap (${heapMB.toFixed(1)}MB) exceeds ${this.thresholds.maxJsHeapMB}MB threshold`);
    }
    if (latest.domNodeCount > this.thresholds.maxDomNodes) {
      warnings.push(`DOM node count (${latest.domNodeCount}) exceeds ${this.thresholds.maxDomNodes} threshold`);
    }
    if (latest.detachedNodeCount > this.thresholds.maxDetachedNodes) {
      warnings.push(`Detached nodes (${latest.detachedNodeCount}) indicate potential memory leak`);
    }

    return warnings;
  }

  getGrowthRate(): number {
    if (this.snapshots.length < 2) return 0;
    const first = this.snapshots[0];
    const last = this.snapshots[this.snapshots.length - 1];
    const durationMs = last.timestamp - first.timestamp;
    if (durationMs <= 0) return 0;
    return ((last.jsHeapSizeBytes - first.jsHeapSizeBytes) / durationMs) * 1000;
  }
}
