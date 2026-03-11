import fs from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Parser } from './parser.js';

vi.mock('node:fs');

afterEach(() => {
  vi.restoreAllMocks();
});

function mockStats(overrides: Partial<fs.Stats> = {}): fs.Stats {
  return {
    isFile: () => false,
    isDirectory: () => false,
    isBlockDevice: () => false,
    isCharacterDevice: () => false,
    isSymbolicLink: () => false,
    isFIFO: () => false,
    isSocket: () => false,
    size: 0,
    ...overrides,
  } as fs.Stats;
}

describe('cross-test parser logic', () => {
  it('handles simple file existence', () => {
    vi.mocked(fs.statSync).mockReturnValueOnce(
      mockStats({ isFile: () => true }),
    );
    const parser = new Parser(['-f', 'test.js']);
    expect(parser.parse()).toBe(true);
  });

  it('handles logical AND (-a)', () => {
    vi.mocked(fs.statSync)
      .mockReturnValueOnce(
        mockStats({ isFile: () => true, size: 100 }),
      )
      .mockReturnValueOnce(
        mockStats({ isFile: () => true, size: 0 }),
      );

    const parser = new Parser(['-f', 'index.js', '-a', '-s', 'empty.js']);
    expect(parser.parse()).toBe(false);
  });

  it('respects parentheses precedence', () => {
    // ( -f a -o -f b ) -a -f c
    // (True OR False) AND True = True
    vi.mocked(fs.statSync)
      .mockReturnValueOnce(mockStats({ isFile: () => true }))
      .mockImplementationOnce(() => {
        throw new Error('ENOENT');
      })
      .mockReturnValueOnce(mockStats({ isFile: () => true }));

    const parser = new Parser([
      '(', '-f', 'a', '-o', '-f', 'b', ')',
      '-a', '-f', 'c',
    ]);
    expect(parser.parse()).toBe(true);
  });

  it('expands environment variables', () => {
    process.env.TEST_VAR = 'production';
    try {
      const parser = new Parser(['$TEST_VAR', '=', 'production']);
      expect(parser.parse()).toBe(true);
    } finally {
      delete process.env.TEST_VAR;
    }
  });

  it('CLI returns exit code 0 for existing file', async () => {
    const { execSync } = await import('node:child_process');
    // Run the built script
    const code = execSync('node ./dist/index.mjs -f package.json');
    expect(code).toBeDefined(); // If it doesn't throw, exit code was 0
  });
});

describe('cross-test error handling', () => {
  it('throws on missing closing parenthesis', () => {
    const parser = new Parser(['(', '-f', 'file.js']);
    expect(() => parser.parse()).toThrow('Missing )');
  });

  it('throws on flags without arguments', () => {
    const parser = new Parser(['-f']);
    expect(() => parser.parse()).toThrow('Flag -f requires an argument');
  });

  it('throws on unknown tokens', () => {
    const parser = new Parser(['-f', 'file.js', 'some-random-word']);
    // The parser should finish at file.js and find 'some-random-word' left over
    expect(() => parser.parse()).toThrow(/Unexpected token/);
  });
});
