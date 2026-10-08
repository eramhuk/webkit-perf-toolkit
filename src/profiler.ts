import type { ProfilerOptions, CaptureReport, FrameMetrics } from './types.js';

const DEFAULT_OPTIONS: ProfilerOptions = {
  sampleRate: 60,
  captureStackTraces: false,
  maxBufferSize: 1024,
};

export function createProfiler(opts?: Partial<ProfilerOptions>) {
  const options = { ...DEFAULT_OPTIONS, ...opts };
  const frames: FrameMetrics[] = [];
  let capturing = false;
  let frameCounter = 0;
  let startTime = 0;

  function startCapture(): void {
    if (capturing) throw new Error('Capture already in progress');
    capturing = true;
    frameCounter = 0;
    frames.length = 0;
    startTime = performance.now();
  }

  function recordFrame(metrics: Omit<FrameMetrics, 'frameId'>): void {
    if (!capturing) return;
    if (frames.length >= options.maxBufferSize) return;

    frames.push({
      frameId: frameCounter++,
      ...metrics,
    });
  }

  function stopCapture(): CaptureReport {
    if (!capturing) throw new Error('No capture in progress');
    capturing = false;

    const totalMs = frames.reduce((sum, f) => sum + f.totalMs, 0);
    const sorted = [...frames].sort((a, b) => a.totalMs - b.totalMs);
    const p95Index = Math.floor(sorted.length * 0.95);

    return {
      frameCount: frames.length,
      avgFrameMs: frames.length > 0 ? totalMs / frames.length : 0,
      p95FrameMs: sorted[p95Index]?.totalMs ?? 0,
      droppedFrames: frames.filter((f) => f.droppedFrame).length,
      frames: [...frames],
      summary() {
        return [
          `Capture Report${options.label ? ` [${options.label}]` : ''}`,
          `  Frames: ${this.frameCount}`,
          `  Avg frame: ${this.avgFrameMs.toFixed(2)}ms`,
          `  P95 frame: ${this.p95FrameMs.toFixed(2)}ms`,
          `  Dropped: ${this.droppedFrames} (${((this.droppedFrames / this.frameCount) * 100).toFixed(1)}%)`,
        ].join('\n');
      },
    };
  }

  return { startCapture, recordFrame, stopCapture };
}
