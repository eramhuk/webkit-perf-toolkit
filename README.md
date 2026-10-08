# webkit-perf-toolkit

A performance analysis toolkit for profiling and benchmarking WebKit's rendering
pipeline. Provides instrumented hooks into the layout, paint, and compositing
stages of the WebKit rendering engine.

## Features

- **Layout Profiler** — Measure and trace layout invalidation cycles
- **Paint Timing Analyzer** — Capture paint region metrics per frame
- **Compositing Debugger** — Inspect layer tree promotion decisions
- **Memory Pressure Monitor** — Track JS heap and DOM node allocation patterns
- **Frame Budget Tracker** — Identify frames exceeding the 16.67ms budget

## Installation

```bash
npm install webkit-perf-toolkit
```

## Usage

```typescript
import { createProfiler } from 'webkit-perf-toolkit';

const profiler = createProfiler({
  sampleRate: 60,
  captureStackTraces: true,
  maxBufferSize: 1024,
});

profiler.startCapture();
// ... run your workload ...
const report = profiler.stopCapture();

console.log(report.summary());
```

## Requirements

- Node.js >= 20
- TypeScript >= 5.5

## License

MIT
