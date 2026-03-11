# cross-test 🛠️

**Cross-platform shell-style conditions for `package.json` scripts.**

`cross-test` is a lightweight, zero-dependency CLI utility
that brings Unix-like `test` (or `[ ]`) functionality to
any operating system. It allows you to write conditional
logic in your `package.json` scripts that works identically
on Windows, macOS, and Linux.

---

## 🚀 Why you need it

Standard shell conditions are not portable:

- **Unix:** `[ -f dist/index.js ] && echo "Ready"` (Fails on Windows CMD/PowerShell)
- **Windows:** `if exist dist\index.js echo Ready` (Fails on Bash/Zsh)
- **cross-test:** `cross-test -f dist/index.js && echo "Ready"` (Works everywhere)

## ✨ Features

- 📦 **Zero Dependencies:** Keeps your `node_modules` tiny.
- ⚡ **ESM-Native:** Built for the modern Node.js ecosystem.
- 🔧 **Internal Variable Expansion:** Supports `$VAR` and `${VAR}` using `process.env`.
- 🧠 **Smart Logic:** Full support for `!`, `-a` (AND), `-o` (OR), and `( )` grouping.

---

## 📥 Installation

```bash
npm install --save-dev @kagal/cross-test
```

## 🛠 Usage

Use it directly in your `package.json` scripts:

```json
{
  "scripts": {
    "dev": "cross-test -f dist/index.js || unbuild --stub",
    "deploy": "cross-test '$NODE_ENV' = 'production' && npm run surge",
    "check": "cross-test '(' -d .git -a -f .env ')' || echo 'Setup incomplete'"
  }
}
```

### Supported Tests

| Flag | Description |
| :--- | :--- |
| `-f <path>` | True if path is a **file**. |
| `-d <path>` | True if path is a **directory**. |
| `-e <path>` | True if path **exists**. |
| `-s <path>` | True if path exists and has **size > 0**. |
| `-n <str>`  | True if string has **non-zero length**. |
| `-z <str>`  | True if string is **empty**. |
| `s1 = s2`   | True if string `s1` equals `s2`. |
| `s1 != s2`  | True if string `s1` does not equal `s2`. |

---

## 📖 Grammar

`cross-test` uses a recursive descent parser.
Precedence from lowest to highest:

```ebnf
expr    = or ;
or      = and { "-o" and } ;
and     = primary { "-a" primary } ;
primary = "!" primary
        | "(" expr ")"
        | string ( "=" | "!=" ) string
        | ( "-n" | "-z" ) string
        | ( "-d" | "-e" | "-f" | "-s" ) path
        ;
```

Variables (`$VAR`, `${VAR}`) are expanded from
`process.env` before parsing.

---

## 📄 License

MIT © 2026
