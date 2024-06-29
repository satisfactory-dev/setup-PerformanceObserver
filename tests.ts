import {
	tap,
} from 'node:test/reporters';
import {
	run,
} from 'node:test';

const __dirname = import.meta.dirname;

const ac = new AbortController();

let already_stopped = false;

run({
	files: [
		`${__dirname}/tests/src/Setup.spec.ts`,
	],
	concurrency: true,
	signal: ac.signal,
})
	.on('test:fail', (e) => {
		ac.abort();
		if (!already_stopped) {
			console.error(e);
		}
		already_stopped = true;
		process.exitCode = 1;
	})
	.compose(tap)
	.pipe(process.stdout);
