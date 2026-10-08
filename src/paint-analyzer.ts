/**
 * Analyzes paint regions to identify unnecessary repaints
 * and overly large paint areas that degrade rendering performance.
 */
export interface PaintRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  timestamp: number;
}

export class PaintAnalyzer {
  private regions: PaintRegion[] = [];

  addRegion(region: PaintRegion): void {
    this.regions.push(region);
  }

  getOverpaintRatio(): number {
    if (this.regions.length < 2) return 0;

    let totalArea = 0;
    let overlappingArea = 0;

    for (let i = 0; i < this.regions.length; i++) {
      const area = this.regions[i].width * this.regions[i].height;
      totalArea += area;

      for (let j = i + 1; j < this.regions.length; j++) {
        const overlap = this.calculateOverlap(this.regions[i], this.regions[j]);
        overlappingArea += overlap;
      }
    }

    return totalArea > 0 ? overlappingArea / totalArea : 0;
  }

  private calculateOverlap(a: PaintRegion, b: PaintRegion): number {
    const xOverlap = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
    const yOverlap = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
    return xOverlap * yOverlap;
  }

  reset(): void {
    this.regions = [];
  }
}
