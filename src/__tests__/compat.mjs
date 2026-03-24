/**
 * Standalone compatibility test — no test framework required.
 * Exercises the cross-test CLI on the current Node version.
 */

/* global console, process */
/* eslint unicorn/no-process-exit: "off" */

import { execFileSync } from 'node:child_process';

const bin = './dist/index.mjs';
let failures = 0;

function run(arguments_, expected) {
  try {
    execFileSync('node', [bin, ...arguments_], { stdio: 'pipe' });
    if (!expected) {
      console.error(`FAIL: expected failure for: ${arguments_.join(' ')}`);
      failures++;
    }
  } catch {
    if (expected) {
      console.error(`FAIL: expected success for: ${arguments_.join(' ')}`);
      failures++;
    }
  }
}

// file tests
run(['-s', bin], true);
run(['-s', 'nonexistent-file'], false);
run(['-f', bin], true);
run(['-d', 'src'], true);
run(['-d', bin], false);

// string tests
run(['-n', 'hello'], true);
run(['-n', ''], false);
run(['-z', ''], true);
run(['-z', 'hello'], false);

// logic
run(['!', '-s', 'nonexistent-file'], true);

if (failures > 0) {
  console.error(`\n${failures} failure(s)`);
  process.exit(1);
} else {
  console.log(`ok ${process.version} — all checks passed`);
}
