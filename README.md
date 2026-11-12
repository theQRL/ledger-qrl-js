# ledger-qrl-js
For the QRL Ledger Nano S app refer to https://github.com/theQRL/ledger-qrl

----------

## Purpose

Node and browser communication APIs for Ledger Nano S

This repo is based on https://github.com/LedgerHQ/ledgerjs

## Initialization on Node

The communication API relies on node-hid

```javascript
ledger.comm_node.create_async().then(function(comm) {
	 ...
});
```

You can also use list_async and create the communication object manually to pick one specific device if several are connected

## Initialization on a browser

The communication API is compatible with every browser supporting FIDO U2F either directly (Chrome, Opera) or through a third party extension (Firefox). Pages shall be served from an HTTPS connection as a requirement of the U2F API.

Make sure to include browser/ledger.min.js and browser/u2f-api.js in your web page and initialize with

```javascript
ledger.comm_u2f.create_async().then(function(comm) {
	 ...
});
```

To re-create the browser bindings, use

```
npm run browserify
npm run uglify
npm run browserify-test (to run browser tests)
```

## Usage

Refer to the tests/examples

## Development and tests

Use Node.js 22.12+ or 24 and `npm ci`. `npm test` runs protocol, transaction
serialization and HID framing tests without a device. The original hardware
smoke tests are available as `npm run test:device` (default app version 0.4.0;
override with `QRL_APP_VERSION`).

Run the historical Nano S emulator tests on Linux with Docker, Git and curl:

```sh
npm ci
npm run test:speculos
```

The script builds QRL app 1.1.2, starts headless Speculos, runs the original
11 smoke assertions plus 9 emulator checks, and removes the container on exit.
Builds and logs are kept in `.speculos/`. Set `SPECULOS_PORT=5001` if port 5000
is occupied. On an ARM Linux VM, first enable x86 emulation for the historical
64-bit compiler and its 32-bit linker:

```sh
docker run --privileged --rm tonistiigi/binfmt --install amd64,386
```

The fixtures use app commit
[`b45f185`](https://github.com/theQRL/ledger-qrl-app/commit/b45f1854a032b31459dac715dde3b74b5edd2e6a)
(May 2019) and SDK commit
[`273d2cd`](https://github.com/LedgerHQ/nanos-secure-sdk/commit/273d2cd9c781141c3d4619b9ac968a5dcfc34297),
the SDK pinned by the historical
[`theQRL/ledger-qrl`](https://github.com/theQRL/ledger-qrl/tree/c2046a8) firmware
repository. This targets Nano S firmware 1.5.x, contemporary with this library's
last functional changes in May 2019 (the June 2020 changes updated dependencies).
Speculos uses `--model nanos --sdk 1.5`; its 0.10.0 image and the original Zondax
build image are pinned by digest. Current Speculos releases no longer support
the original Nano S. Only `TESTING_ENABLED` is enabled in the fixture; the app's
seed and signing implementation are unchanged.

These are communication smoke tests: version, diagnostic responses up to 255
bytes, state and rejected instructions. They do not establish signing/key
generation correctness or physical USB/U2F interoperability. HID framing has
separate device-free tests. Production `src/` code is unchanged.

GitHub Actions runs unit tests and all browser builds on Node 22 and 24, plus
the emulator tests with both the original production lockfile at `374242f` and
the updated lockfile. The baseline install skips native HID compilation because
the emulator uses a test-only HTTP transport; the updated job installs native
HID normally. The original baseline passed 11 smoke assertions and 9 emulator
checks before dependency changes on 2026-11-12.
The final updated lockfile also passed all 11 unit/HID tests, 20 emulator
assertions and browser builds in Linux containers on both Node 22 and 24.

Dependency updates start from upstream Dependabot
[Mocha/flat #46](https://github.com/theQRL/ledger-qrl-js/pull/46),
[glob-parent #40](https://github.com/theQRL/ledger-qrl-js/pull/40),
[lodash #39](https://github.com/theQRL/ledger-qrl-js/pull/39), and
[y18n #38](https://github.com/theQRL/ledger-qrl-js/pull/38).
Mocha 12 supersedes the proposed Mocha 10 update to avoid its vulnerable
serializer; scoped glob/minimatch overrides address subsequent advisories in
Mocha's dependencies. Node HID 3 supports current Node versions; Chai stays on
CommonJS-compatible v4. Chai and Mocha are development dependencies. The lockfile
refresh removes or updates the transitive packages in those older proposals.
`npm audit --omit=dev` reports no vulnerabilities as of 2026-11-12; four low
severity findings remain in Browserify's elliptic dependency chain.

Rebuild the distributed browser bundle with `npm run browserify && npm run uglify`.
