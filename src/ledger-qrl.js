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

LedgerQrl.prototype.get_version = function () {
    var buffer = "8000";
    return this.comm.exchange(buffer.toString('hex'), [0x9000]).then(
        function (apduResponse) {
            var result = {};
            apduResponse = Buffer.from(apduResponse, 'hex');
            console.log(apduResponse);

            result["test_mode"] = apduResponse[0] !== 0;
            result["major"] = apduResponse[1];
            result["minor"] = apduResponse[2];
            result["patch"] = apduResponse[3];

            return result;
        });
};

LedgerQrl.prototype.get_state = function () {
    var buffer = "8001";
    return this.comm.exchange(buffer.toString('hex'), [0x9000]).then(
        function (apduResponse) {
            var result = {};
            apduResponse = Buffer.from(apduResponse, 'hex');
            console.log(apduResponse);
            return result;
        });
};

// LedgerQrl.MAX_SCRIPT_BLOCK = 50;
// LedgerQrl.DEFAULT_LOCKTIME = 0;
// LedgerQrl.DEFAULT_SEQUENCE = 0xffffffff;
// LedgerQrl.SIGHASH_ALL = 1;

module.exports = LedgerQrl;
