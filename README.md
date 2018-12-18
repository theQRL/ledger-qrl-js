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
