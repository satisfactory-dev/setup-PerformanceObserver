import {
	describe,
	it,
} from 'node:test';
import assert from 'node:assert/strict';

import setup_PerformanceObserver from '../../src/Setup';

void describe('Setup', () => {
	function call_perf() {
		performance.mark('start');
		performance.measure('baz', 'start');
		performance.measure('bar', 'start');
		performance.measure('foo', 'start');
		performance.measure('bag', 'start');
	}

	async function delay() {
		await (new Promise((yup) => {
			setTimeout(yup, 1000);
		}));
	}

	void describe('results', () => {
		void it('behaves with ordering', async () => {
			const instance = new setup_PerformanceObserver({
				clear_lines: false,
				tweak_order_by_prefix: [
					'foo',
					'bar',
				],
			});
			instance.obs.observe({entryTypes: ['measure'], buffered: true});

			call_perf();

			await delay();

			assert.deepStrictEqual(
				Object.keys(instance.results),
				[
					'foo',
					'bar',
					'baz',
					'bag',
				]
			)
		})
		void it('behaves without ordering', async () => {
			const instance = new setup_PerformanceObserver({
				clear_lines: false,
			});
			instance.obs.observe({entryTypes: ['measure'], buffered: true});

			call_perf();

			await delay();

			assert.deepStrictEqual(
				Object.keys(instance.results),
				[
					'baz',
					'bar',
					'foo',
					'bag',
				]
			)
		})
	})

	void describe('last_total_lines', () => {
		void it('behaves', async() => {
			const instance = new setup_PerformanceObserver();

			assert.strictEqual(
				instance.last_total_lines,
				0
			);

			instance.obs.observe({entryTypes: ['measure'], buffered: true});

			assert.strictEqual(
				instance.last_total_lines,
				0
			);

			call_perf();

			await delay();

			assert.strictEqual(
				instance.last_total_lines,
				0
			);

			instance.log();

			assert.strictEqual(
				instance.last_total_lines,
				4
			);

			await delay();

			instance.log();

			await delay();

			instance.log();

			assert.strictEqual(
				instance.last_total_lines,
				4
			);
		})
	})
})
