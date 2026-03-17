---
description: Identify, measure, and resolve performance bottlenecks across the application stack
---
# Workflow: optimize-performance

## Purpose
Identify, measure, and resolve performance bottlenecks across the application stack — covering frontend rendering performance, backend response latency, database query efficiency, and network payload optimization. This workflow is measurement-driven: every optimization must be justified by data and verified by re-measurement.

## When to Use
Invoke `/optimize-performance` when users report slowness, when profiling reveals specific bottlenecks, before a traffic-intensive launch, when page load times or API response times exceed acceptable thresholds, or as a scheduled performance health review.

## Required Inputs
- The performance problem description (slow page, slow endpoint, high database load, etc.)
- Baseline performance measurements (if available)
- The target performance goal (e.g., "API P95 latency under 200ms", "LCP under 2.5s")

## Architecture Selection
No new architectural decisions. The agent reads existing tech stack documentation and adapts optimization approaches to the confirmed stack.

## Steps

### Step 1 — Establish Measurement Baselines
Never optimize without measuring first. Establish baselines for the targeted scope:

**For frontend performance:**
- Run Lighthouse audit and record all Core Web Vitals: LCP, FID/INP, CLS, TTFB, FCP
- Record bundle sizes using the bundle analyzer for the confirmed build tool
- Record render times for slow components using browser DevTools profiler

**For backend performance:**
- Record P50, P95, and P99 response times for the affected endpoints
- Record database query execution times using the query log or explain plan
- Record memory usage and CPU utilization under typical and peak load

**For database performance:**
- Run EXPLAIN ANALYZE on slow queries
- Record the number of queries per request (identify N+1 patterns)
- Record index usage statistics

Document all baseline numbers before any optimization begins. Without a baseline, "improvement" is unmeasurable.

### Step 2 — Identify the Bottleneck
Use the measurements to identify where time is actually being spent. Common sources in order of investigation:

**Database bottlenecks (most common):**
- Full table scans due to missing indexes
- N+1 queries (one query per item in a list)
- Over-fetching (selecting all columns when only a few are needed)
- Missing connection pooling or pool exhaustion
- Unoptimized JOIN operations

**Backend bottlenecks:**
- Synchronous operations blocking the event loop or thread pool
- Unparallelized I/O (sequential awaits that could be concurrent)
- Missing caching for expensive computed values
- Serialization/deserialization of very large objects
- Unbounded background jobs consuming server resources

**Network bottlenecks:**
- Large uncompressed API responses
- Missing HTTP caching headers on static or semi-static responses
- Too many round trips (chatty API design)
- Missing CDN for static assets

**Frontend bottlenecks:**
- Large JavaScript bundles not split by route
- Rendering too many DOM nodes
- Unnecessary re-renders (state updates in wrong scope)
- Images not optimized, sized, or lazy loaded
- Render-blocking resources (scripts or styles in document head)
- Missing virtualization for long lists

### Step 3 — Propose Optimizations
For each identified bottleneck, propose specific, measurable optimizations. For each proposal:
- State the optimization technique
- Explain why it addresses the identified bottleneck
- Estimate the effort and expected impact (rough order of magnitude)

Present proposals to the user and ask:
- "Which of these should we prioritize based on expected impact and effort?"

Do not implement all optimizations at once. Prioritize and implement sequentially so each change's impact can be measured independently.

### Step 4 — Implement Database Optimizations
Apply approved database optimizations:
- **Add missing indexes**: create indexes using migration files; test query plan improvement with EXPLAIN ANALYZE
- **Fix N+1 queries**: refactor queries to use JOIN, eager loading, or batched queries
- **Reduce over-fetching**: select only the columns needed for each query
- **Add query result caching**: for expensive, infrequently changing queries, add a cache layer with an appropriate TTL and cache invalidation strategy
- **Optimize connection pooling**: review pool size configuration against database connection limits

### Step 5 — Implement Backend Optimizations
Apply approved backend optimizations:
- **Parallelize independent async operations**: convert sequential awaits to `Promise.all` or equivalent where operations are independent
- **Add response caching**: for endpoints whose output is stable for a period, add HTTP caching headers or an in-process cache
- **Add CDN caching**: for endpoints serving static or user-agnostic content, configure CDN cache rules
- **Implement pagination**: for any endpoint returning unbounded lists, enforce pagination
- **Offload to background jobs**: for operations that do not need to complete within the HTTP request lifecycle, move them to a queue and return immediately

### Step 6 — Implement Frontend Optimizations
Apply approved frontend optimizations:
- **Code splitting**: split the JavaScript bundle by route so users only download code for the page they are visiting
- **Image optimization**: convert images to modern formats (WebP, AVIF); add explicit width and height attributes; implement lazy loading for below-the-fold images; use a responsive image strategy (`srcset`)
- **Fix unnecessary re-renders**: move state lower in the component tree; memoize expensive derived values; use React.memo, useMemo, or equivalent only where profiling confirms a benefit
- **Implement virtualization**: for lists with more than 50–100 items, use a virtual list component that only renders visible items
- **Optimize font loading**: use `font-display: swap`; subset fonts to required characters; preload critical fonts
- **Preload critical resources**: add `<link rel="preload">` for above-the-fold critical assets

### Step 7 — Measure After Each Optimization
After each optimization is applied:
- Re-run the same measurements from Step 1
- Record the before and after numbers for the specific metric targeted
- If the optimization did not produce a meaningful improvement, investigate why before continuing
- If the optimization introduced a regression in another metric, assess the tradeoff

### Step 8 — Document the Optimizations
Update or create `docs/performance.md` with:
- Baseline performance metrics (before)
- Final performance metrics (after)
- Each optimization applied with the technique, the metric targeted, and the measured improvement
- Any optimizations attempted but abandoned, and why

### Step 9 — Set Up Performance Monitoring
If not already in place, recommend and configure:
- Performance monitoring in CI (fail builds if bundle size or Lighthouse score regresses beyond a threshold)
- Uptime and latency monitoring for production (alert if P95 latency exceeds target)
- Database slow query logging with alerting

### Step 10 — Commit Optimizations
Each optimization should be a separate commit:
```
perf(<scope>): <description of optimization>

Before: <metric> = <value>
After: <metric> = <value>
Technique: <what was done and why>
```

## Expected Outputs
- Baseline and post-optimization performance measurements
- Implemented database, backend, and frontend optimizations
- Updated `docs/performance.md` with metrics and techniques
- Performance monitoring configuration
- Atomic commits with before/after metrics in commit messages
