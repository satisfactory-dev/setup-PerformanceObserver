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

	function reset_between_tests() {
		performance.clearMeasures();
		performance.clearMarks();
		performance.clearResourceTimings();
	}

	void describe('results', () => {
		void it('behaves with ordering', async () => {
			reset_between_tests();
			const instance = new setup_PerformanceObserver({
				log_on_observe: false,
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
			reset_between_tests();
			const instance = new setup_PerformanceObserver({
				log_on_observe: false,
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
		for (const log_on_observe of [
			true,
			false,
		]) {
			void it(
				`behaves with log_on_observe===${
					log_on_observe
						? 'true'
						: 'false'
				}`,
				async() => {
					reset_between_tests();
					const instance = new setup_PerformanceObserver({
						log_on_observe,
					});

					assert.strictEqual(
						instance.last_total_lines,
						0,
						'should have zero lines on instantiation'
					);

					instance.obs.observe({
						entryTypes: ['measure'],
						buffered: true,
					});

					assert.strictEqual(
						instance.last_total_lines,
						0,
						'should have zero lines after starting observation'
					);

					call_perf();

					await delay();

					assert.strictEqual(
						instance.last_total_lines,
						log_on_observe ? 4 : 0 ,
						`should have ${
							log_on_observe ? 4 : 0
						} when log_on_observe is ${
							log_on_observe ? 'true' : 'false'
						}`
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
		}
	})
})
