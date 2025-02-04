Typhlotype is a tool for learning and practicing typing designed for people with impaired vision.

## Similar tools

### Designed to be accessible
- [Doorway Text Type](https://www.doorwayonline.org.uk/typing/text-type/): Free of charge. Web. English and Welsh.
- [Typer Online](https://typer.aphtech.org/): Free of charge. Web. English only.

### Not designed to be accessible
- [Keybr](https://www.keybr.com/): Free of charge. Web.
- [Monkeytype](https://monkeytype.com/): Free of charge. Web.

## How do develop, build, and run

This project has the following build dependencies:

- [The Deno Runtime](https://deno.com/) (`deno`)
- [The TypeScript Compiler](https://www.typescriptlang.org/download/) (`tsc`)

### Building

Run `./build.ts` (or `deno --allow-all build.ts`).

### Start development server

Run `./build.ts --serve` (or `deno --allow-all build.ts --serve`).

### Run tests

Run `deno test --unstable-sloppy-imports`
