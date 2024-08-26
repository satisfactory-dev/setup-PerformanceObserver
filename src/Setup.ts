import * as readline from 'node:readline';

export type constructor_args = {
	clear_lines: boolean,
	tweak_order_by_prefix: string[],
	log_on_observe: boolean,
};

export default class Setup
{
	#last_total_lines:number = 0;

	readonly clear_lines:boolean;

	readonly log_on_observe:boolean;

	readonly measured_totals: {[key: string]: [number, number]} = {};

	readonly obs:PerformanceObserver;

	readonly tweak_order_by_prefix:string[];

	constructor(
		{
			clear_lines = true,
			tweak_order_by_prefix = [],
			log_on_observe = true,
		}: Partial<constructor_args> = {},
	) {
		this.clear_lines = clear_lines;
		this.tweak_order_by_prefix = tweak_order_by_prefix;
		this.log_on_observe = log_on_observe;

		this.obs = new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				if (!(entry.name in this.measured_totals)) {
					this.measured_totals[entry.name] = [0, 0];
				}
				this.measured_totals[entry.name][0] += entry.duration;
				this.measured_totals[entry.name][1] += 1;
			}

			if (this.log_on_observe) {
				this.log();
			}
		})
	}

	get last_total_lines()
	{
		return this.#last_total_lines;
	}

	get results()
	{
		const results = Object.entries(this.measured_totals).map((
			e,
		): [string, {[key: string]: string|number}] => {
			return [
				e[0],
				{
					'total time': `${(e[1][0] / 1000).toFixed(4)}s`,
					amount: e[1][1],
					'average per call': `${(e[1][0] / e[1][1]).toFixed(4)}ms`,
				},
			];
		});

		return Object.fromEntries(
			results.sort((a, b) => {
				const a_prefix = this.tweak_order_by_prefix.find(
					maybe => a[0].startsWith(maybe),
				);
				const b_prefix = this.tweak_order_by_prefix.find(
					maybe => b[0].startsWith(maybe),
				);

				if (a_prefix || b_prefix) {
					if (!b_prefix) {
						return -1;
					} else if (!a_prefix) {
						return 1;
					}

					return (
						this.tweak_order_by_prefix.indexOf(
							a_prefix,
						) - this.tweak_order_by_prefix.indexOf(
							b_prefix,
						)
					);
				}

				return 0; // leave in order they came in
			}),
		)
	}

	log()
	{
		const results = this.results;

		this.#last_total_lines = Object.keys(results).length;

		if (this.clear_lines && this.#last_total_lines) {
			readline.moveCursor(
				process.stdout,
				0,
				0 - (this.#last_total_lines + 4),
			);
			readline.clearLine(process.stdout, 1);
		}

		console.table(results);

		performance.clearMeasures();
	}
}
