# Developer Setup

This project uses [Deno 2](https://deno.land/) which has built-in support for importing npm modules.

## Prerequisites

- **Deno 2** installed on your machine.
- Internet access, so that Deno can fetch npm dependencies.

## Installation

1. **Clone or Download** this repository into a local folder.

2. **Install Deno** if you have not already. [Deno Installation Docs](https://docs.deno.com/runtime/#install-deno)

3. **Verify Deno** is installed:

```bash
deno --version
```

Make sure the reported version is 2.0.0 or higher.

## Running Project Scripts

This repo includes useful tasks defined in deno.json. You can run them using Deno’s built-in task runner:

### `process-all-maps`

This task does everything. It fetches all maps from the [shared FE Repo](https://github.com/Klokinator/FE-Repo) and converts them to JSON usable in the [Lex Talionis](https://gitlab.com/rainlash/lt-maker) game engine.

```bash
deno task process-all-maps
```

### `clean`

This task deletes all downloaded and generated files (they live in the `/input/` and `/output/` directories).

```bash
deno task clean
```

### `convert-input`

Converts all `.tmx` files in the `/input/` directory to `.json` files in the `/output/` directory.

**This is where you can convert your own `.tmx` files not found in the FE repo.** Just add the tmx files to the `/input/` directory and run this task.

```bash
deno task convert-input
```
