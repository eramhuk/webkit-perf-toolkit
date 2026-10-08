/**
 * Inspects compositing layer promotion decisions made by the WebKit
 * compositor. Identifies elements that were promoted to their own
 * compositing layer and the reason for promotion.
 */
export type PromotionReason =
  | 'transform-3d'
  | 'will-change'
  | 'fixed-position'
  | 'video-element'
  | 'canvas-element'
  | 'overlap'
  | 'animation';

export interface LayerInfo {
  elementSelector: string;
  reason: PromotionReason;
  memoryEstimateBytes: number;
  hasBackdropFilter: boolean;
}

export class CompositingDebugger {
  private layers: LayerInfo[] = [];

  registerLayer(info: LayerInfo): void {
    this.layers.push(info);
  }

  getTotalMemoryEstimate(): number {
    return this.layers.reduce((sum, l) => sum + l.memoryEstimateBytes, 0);
  }

  getLayersByReason(reason: PromotionReason): LayerInfo[] {
    return this.layers.filter((l) => l.reason === reason);
  }

  getReport(): string {
    const totalMB = (this.getTotalMemoryEstimate() / (1024 * 1024)).toFixed(2);
    const lines = [
      `Compositing Layer Report`,
      `  Total layers: ${this.layers.length}`,
      `  Estimated GPU memory: ${totalMB} MB`,
      `  Breakdown by reason:`,
    ];

    const grouped = new Map<PromotionReason, number>();
    for (const layer of this.layers) {
      grouped.set(layer.reason, (grouped.get(layer.reason) ?? 0) + 1);
    }
    for (const [reason, count] of grouped) {
      lines.push(`    ${reason}: ${count}`);
    }

    return lines.join('\n');
  }
}
