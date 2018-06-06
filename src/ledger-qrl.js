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

const INS_VERSION             = 0x00;
const INS_GETSTATE            = 0x01;
const INS_PUBLIC_KEY          = 0x03;
const INS_SIGN                = 0x04;
const INS_SIGN_NEXT           = 0x05;

/* These instructions are only enabled in test mode */
const INS_TEST_PK_GEN_1       = 0x80;
const INS_TEST_PK_GEN_2       = 0x81;
const INS_TEST_CALC_PK        = 0x82;
const INS_TEST_WRITE_LEAF     = 0x83;
const INS_TEST_READ_LEAF      = 0x84;
const INS_TEST_KEYGEN         = 0x85;
const INS_TEST_DIGEST         = 0x86;
const INS_TEST_SETSTATE       = 0x87;
const INS_TEST_COMM           = 0x88;

const APDU_ERROR_CODE_OK = 0x9000;

function serialize(CLA, INS, p1 = 0, p2 = 0, data = null) {
    var size = 5;

    if (data != null)
        size += data.length;

    var buffer = Buffer.alloc(size);
    buffer[0] = CLA;
    buffer[1] = INS;
    buffer[2] = p1;
    buffer[3] = p2;
    buffer[4] = 0;

    if (data != null) {
        if (buffer.length > 255)
        {
            throw new Error('maximum data size = 255');
        }
        buffer[4] = buffer.length;
        data.copy(buffer, 5);
    }

    return buffer;
}

LedgerQrl.prototype.get_version = function () {
    var buffer = serialize(CLA, INS_VERSION, 0, 0);

    return this.comm.exchange(buffer.toString("hex"), [0x9000]).then(
        function (apduResponse) {
            var result = {};
            apduResponse = Buffer.from(apduResponse, 'hex');
            let error_code_data = apduResponse.slice(-2);

            result["test_mode"] = apduResponse[0] !== 0;
            result["major"] = apduResponse[1];
            result["minor"] = apduResponse[2];
            result["patch"] = apduResponse[3];
            result["return_code"] = error_code_data[0] * 256 + error_code_data[1];
            return result;
        });
};

LedgerQrl.prototype.get_state = function () {
    var buffer = serialize(CLA, INS_GETSTATE, 0, 0);

    return this.comm.exchange(buffer.toString('hex'), [0x9000]).then(
        function (apduResponse) {
            var result = {};
            apduResponse = Buffer.from(apduResponse, 'hex');
            let error_code_data = apduResponse.slice(-2);

            result["mode"] = 0;
            result["xmss_index"] = apduResponse[1] + apduResponse[2] * 256;
            result["return_code"] = error_code_data[0] * 256 + error_code_data[1];
            return result;
        });
};

LedgerQrl.prototype.publickey = function () {
    var buffer = serialize(CLA, INS_PUBLIC_KEY);

    return this.comm.exchange(buffer.toString('hex'), [0x9000]).then(
        function (apduResponse) {
            var result = {};
            apduResponse = Buffer.from(apduResponse, 'hex');
            let error_code_data = apduResponse.slice(-2);

            result["public_key"] = apduResponse.slice(0, apduResponse.length-2);
            result["return_code"] = error_code_data[0] * 256 + error_code_data[1];
            return result;
        });
};

LedgerQrl.prototype.sign = function () {
    var buffer = serialize(CLA, INS_SIGN, 0, 0);

    return this.comm.exchange(buffer.toString('hex'), [0x9000]).then(
        function (apduResponse) {
            var result = {};
            apduResponse = Buffer.from(apduResponse, 'hex');
            let error_code_data = apduResponse.slice(-2);

            result["signature_chunk"] = apduResponse.slice(0, apduResponse.length-2);
            result["return_code"] = error_code_data[0] * 256 + error_code_data[1];
            return result;
        });
};

LedgerQrl.prototype.signNext = function () {
    var buffer = serialize(CLA, INS_SIGN_NEXT);

    return this.comm.exchange(buffer.toString('hex'), [0x9000]).then(
        function (apduResponse) {
            var result = {};
            apduResponse = Buffer.from(apduResponse, 'hex');
            let error_code_data = apduResponse.slice(-2);

            result["signature_chunk"] = apduResponse.slice(0, apduResponse.length-2);
            result["return_code"] = error_code_data[0] * 256 + error_code_data[1];
            return result;
        });
};

LedgerQrl.prototype.test_comm = function (count) {
    let buffer = serialize(CLA, INS_TEST_COMM, count);

    return this.comm.exchange(buffer.toString('hex'), [0x9000]).then(
        function (apduResponse) {
            var result = {};
            apduResponse = Buffer.from(apduResponse, 'hex');
            let error_code_data = apduResponse.slice(-2);

            result["test_answer"] = apduResponse.slice(0, apduResponse.length-2);
            result["return_code"] = error_code_data[0] * 256 + error_code_data[1];

            return result;
        });
};

module.exports = LedgerQrl;
