export interface ProfilerOptions {
  /** Sampling rate in Hz. Defaults to 60. */
  sampleRate: number;
  /** Whether to capture JS stack traces at each sample. */
  captureStackTraces: boolean;
  /** Maximum number of samples to buffer before flushing. */
  maxBufferSize: number;
  /** Optional label for the capture session. */
  label?: string;
}

export interface FrameMetrics {
  /** Frame sequence number. */
  frameId: number;
  /** Total frame duration in milliseconds. */
  totalMs: number;
  /** Time spent in layout recalculation. */
  layoutMs: number;
  /** Time spent in paint operations. */
  paintMs: number;
  /** Time spent in compositing. */
  compositeMs: number;
  /** Whether this frame exceeded the 16.67ms budget. */
  droppedFrame: boolean;
  /** Number of layout invalidations triggered. */
  layoutInvalidations: number;
}

export interface CaptureReport {
  /** Total number of frames captured. */
  frameCount: number;
  /** Average frame duration in milliseconds. */
  avgFrameMs: number;
  /** 95th percentile frame duration. */
  p95FrameMs: number;
  /** Number of dropped frames. */
  droppedFrames: number;
  /** Individual frame metrics. */
  frames: FrameMetrics[];
  /** Returns a human-readable summary string. */
  summary(): string;
}
