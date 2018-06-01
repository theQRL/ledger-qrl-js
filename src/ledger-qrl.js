/********************************************************************************
 *   Ledger Node JS API
 *   (c) 2016-2017 Ledger
 *   (c) 2018 ZondaX GmbH
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ********************************************************************************/

'use strict';

var Q = require('q');
var utils = require('./utils');

var LedgerQrl = function (comm) {
    this.comm = comm;
    this.comm.setScrambleKey('QRL');
};

const CLA = 0x77;

const INS_VERSION = 0x00;
const INS_GETSTATE = 0x01;
const INS_KEYGEN = 0x02;
const INS_PUBLIC_KEY = 0x03;
const INS_SIGN = 0x04;
const INS_SIGN_NEXT = 0x05;

/* These instructions are only enabled in test mode */
const INS_TEST_WRITE_LEAF = 0x83;
const INS_TEST_READ_LEAF = 0x84;
const INS_TEST_DIGEST = 0x85;
const INS_TEST_SETSTATE = 0x88;
const INS_TEST_COMM = 0x89;

function serialize(CLA, INS, p1 = 0, p2 = 0, data = null) {
    var size = 5;

    if (data != null)
        size += data.length;

    var buffer = Buffer.alloc(size);
    buffer[0] = CLA;
    buffer[1] = INS;
    buffer[2] = p1;
    buffer[3] = p2;

    if (data != null)
        data.copy(buffer, 4);

    return buffer;
}

LedgerQrl.prototype.get_version = function () {
    var buffer = serialize(CLA, INS_VERSION, 0, 0);

    return this.comm.exchange(buffer.toString("hex"), [0x9000]).then(
        function (apduResponse) {
            var result = {};
            apduResponse = Buffer.from(apduResponse, 'hex');
            result["test_mode"] = apduResponse[0] !== 0;
            result["major"] = apduResponse[1];
            result["minor"] = apduResponse[2];
            result["patch"] = apduResponse[3];
            return result;
        });
};

LedgerQrl.prototype.get_state = function () {
    var buffer = serialize(CLA, INS_GETSTATE, 0, 0);

    return this.comm.exchange(buffer.toString('hex'), [0x9000]).then(
        function (apduResponse) {
            var result = {};
            apduResponse = Buffer.from(apduResponse, 'hex');
            result["mode"] = 0;
            result["xmss_index"] = apduResponse[1] + apduResponse[2] * 256;
            console.log(apduResponse);
            return result;
        });
};

LedgerQrl.prototype.keygen = function () {
    var buffer = serialize(CLA, INS_KEYGEN, 0, 0);

    return this.comm.exchange(buffer.toString('hex'), [0x9000]).then(
        function (apduResponse) {
            var result = {};
            apduResponse = Buffer.from(apduResponse, 'hex');
            result["mode"] = 0;
            result["xmss_index"] = apduResponse[1] + apduResponse[2] * 256;
            console.log(apduResponse);
            return result;
        });
};

LedgerQrl.prototype.publickey = function () {
    var buffer = serialize(CLA, INS_PUBLIC_KEY, 0, 0);

    return this.comm.exchange(buffer.toString('hex'), [0x9000]).then(
        function (apduResponse) {
            var result = {};
            apduResponse = Buffer.from(apduResponse, 'hex');
            result["mode"] = 0;
            result["xmss_index"] = apduResponse[1] + apduResponse[2] * 256;
            console.log(apduResponse);
            return result;
        });
};

LedgerQrl.prototype.sign = function () {
    var buffer = serialize(CLA, INS_SIGN, 0, 0);

    return this.comm.exchange(buffer.toString('hex'), [0x9000]).then(
        function (apduResponse) {
            var result = {};
            apduResponse = Buffer.from(apduResponse, 'hex');
            console.log(apduResponse);
            return result;
        });
};

LedgerQrl.prototype.signNext = function () {
    var buffer = serialize(CLA, INS_SIGN_NEXT, 0, 0);

    return this.comm.exchange(buffer.toString('hex'), [0x9000]).then(
        function (apduResponse) {
            var result = {};
            apduResponse = Buffer.from(apduResponse, 'hex');
            result["chunk"] = apduResponse;
            console.log(apduResponse);
            return result;
        });
};

/* These instructions are only enabled in test mode */
// const INS_TEST_WRITE_LEAF = 0x83;
// const INS_TEST_READ_LEAF = 0x84;
// const INS_TEST_DIGEST = 0x85;
// const INS_TEST_SETSTATE = 0x88;
// const INS_TEST_COMM = 0x89;

LedgerQrl.prototype.digest = function (size) {
    var buffer = serialize(CLA, INS_TEST_DIGEST, size, 0);

    return this.comm.exchange(buffer.toString('hex'), [0x9000]).then(
        function (apduResponse) {
            var result = {};
            apduResponse = Buffer.from(apduResponse, 'hex');
            result["data"] = apduResponse.slice(0, -2);
            console.log(apduResponse);
            return result;
        });
};

LedgerQrl.prototype.test_comm = function (size) {
    var buffer = serialize(CLA, INS_TEST_COMM, size, 0);

    return this.comm.exchange(buffer.toString('hex'), [0x9000]).then(
        function (apduResponse) {
            var result = {};
            apduResponse = Buffer.from(apduResponse, 'hex');
            result["data"] = apduResponse.slice(0, -2);
            console.log(apduResponse);
            return result;
        });
};

module.exports = LedgerQrl;
