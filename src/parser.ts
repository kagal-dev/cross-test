import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const FILE_FLAGS = ['-d', '-e', '-f', '-s'] as const;
const STRING_FLAGS = ['-n', '-z'] as const;
const COMPARE_OPS = ['=', '!='] as const;

type FileFlag = typeof FILE_FLAGS[number];
type StringFlag = typeof STRING_FLAGS[number];
type CompareOp = typeof COMPARE_OPS[number];

const FILE_FLAGS_SET: ReadonlySet<string> = new Set(FILE_FLAGS);
const STRING_FLAGS_SET: ReadonlySet<string> = new Set(STRING_FLAGS);
const COMPARE_OPS_SET: ReadonlySet<string> = new Set(COMPARE_OPS);

function expand(token: string): string {
  const regex = /\$(?:\{([\w]+)\}|([\w]+))/g;
  return token.replaceAll(regex, (_, p1, p2) => {
    const variableName = p1 || p2;
    return process.env[variableName] || '';
  });
}

function runCompare(
  op: CompareOp,
  left: string,
  right: string,
): boolean {
  switch (op) {
    case '=': return left === right;
    case '!=': return left !== right;
  }
}

function runStringTest(
  flag: StringFlag,
  value: string,
): boolean {
  switch (flag) {
    case '-n': return value.length > 0;
    case '-z': return value.length === 0;
  }
}

function runFileTest(flag: FileFlag, target: string): boolean {
  if (target === '') return false;
  try {
    const fullPath = path.resolve(process.cwd(), target);
    const stats = fs.statSync(fullPath);
    switch (flag) {
      case '-f': return stats.isFile();
      case '-d': return stats.isDirectory();
      case '-s': return stats.size > 0;
      case '-e': return true;
    }
  } catch {
    return false;
  }
}

export class Parser {
  private tokens: string[];

  constructor(tokens: string[]) {
    this.tokens = tokens.map(t => expand(t));
  }

  parse(): boolean {
    const result = this.evaluateOr();
    if (this.tokens.length > 0)
      throw new Error(`Unexpected token: ${this.tokens[0]}`);
    return result;
  }

  private evaluateOr(): boolean {
    let result = this.evaluateAnd();
    while (this.tokens[0] === '-o') {
      this.tokens.shift();
      const right = this.evaluateAnd();
      result = result || right;
    }
    return result;
  }

  private evaluateAnd(): boolean {
    let result = this.evaluatePrimary();
    while (this.tokens[0] === '-a') {
      this.tokens.shift();
      const right = this.evaluatePrimary();
      result = result && right;
    }
    return result;
  }

  private evaluatePrimary(): boolean {
    const token = this.tokens.shift();
    if (token === undefined)
      throw new Error('Unexpected end of expression');

    if (token === '!') return !this.evaluatePrimary();

    if (token === '(') {
      const result = this.evaluateOr();
      if (this.tokens.shift() !== ')')
        throw new Error('Missing )');
      return result;
    }

    if (this.tokens[0] !== undefined &&
      COMPARE_OPS_SET.has(this.tokens[0])) {
      const op = this.tokens.shift() as CompareOp;
      const right = this.tokens.shift();
      if (right === undefined)
        throw new Error(
          `Operator ${op} requires a right operand`,
        );
      return runCompare(op, token, right);
    }

    if (STRING_FLAGS_SET.has(token)) {
      const argument = this.tokens.shift();
      if (argument === undefined)
        throw new Error(
          `Flag ${token} requires an argument`,
        );
      return runStringTest(token as StringFlag, argument);
    }

    if (FILE_FLAGS_SET.has(token)) {
      const target = this.tokens.shift();
      if (target === undefined)
        throw new Error(
          `Flag ${token} requires an argument`,
        );
      return runFileTest(token as FileFlag, target);
    }

    throw new Error(`Unexpected token: ${token}`);
  }
}
