import process from 'node:process';
import { Parser } from './parser.js';

const arguments_: string[] = process.argv.slice(2);

if (arguments_.length === 0) {
  console.error('Usage: cross-test <expression>');
  process.exit(1);
}

try {
  const parser = new Parser(arguments_);
  process.exit(parser.parse() ? 0 : 1);
} catch (error) {
  console.error(
    `cross-test error: ${(error as Error).message}`,
  );
  process.exit(1);
}
