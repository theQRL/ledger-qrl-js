/********************************************************************************
 *   Ledger Node JS QRL Tests
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

var assert = require('assert');
var expect = require('chai').expect;
var Q = require('q');

if (typeof ledger === 'undefined') {
    ledger = require('../src');
    comm = ledger.comm_node;
    browser = false;
}
else {
    browser = true;
    comm = ledger.comm_u2f;
}

TIMEOUT = 1000;
EXPECTED_MAJOR = 0;
EXPECTED_MINOR = 1;
EXPECTED_PATCH = 0;

function runTests() {

    return comm.create_async(TIMEOUT, true).then(
        function (comm) {
            console.log("A")

            try {
                let qrl = new ledger.qrl(comm);
                return qrl.get_version().then(function (result) {
                    console.log("B")
                    console.log(result);
                })
            }
            catch(e)
            {
                console.log(e)
            }
        });
}

if (!browser) {
    runTests();
}

module.exports = runTests;
