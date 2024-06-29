[![Coverage Status](https://coveralls.io/repos/github/satisfactory-dev/setup-PerformanceObserver/badge.svg?branch=main)](https://coveralls.io/github/satisfactory-dev/setup-PerformanceObserver?branch=main)
[![Workflow Status](https://github.com/satisfactory-dev/setup-PerformanceObserver/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/satisfactory-dev/setup-PerformanceObserver/actions/workflows/node.js.yml?query=branch%3Amain)

# Install

-   `npm install --save-dev @signpostmarv/setup-performance-observer`

# Usage

```ts
import setup_PerformanceObserver '@signpostmarv/setup-performance-observer';

const instance = new setup_PerformanceObserver({
	clear_lines: false,
	tweak_order_by_prefix: [
		'foo',
		'bar',
	],
});
instance.obs.observe({entryTypes: ['measure'], buffered: true});
// do work here
instance.log(); // maybe add this in a loop or interval
```
