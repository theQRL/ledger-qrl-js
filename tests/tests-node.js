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

describe('get_version', function () {
    let response;
    // call API
    before(function () {
        return comm.create_async(TIMEOUT, true).then(
                function (comm) {
                    let qrl = new ledger.qrl(comm);
                    return qrl.get_version().then(function (result) {
                        response = result;
                        console.log(response);
                    })
                });
        });

    it('get_version has property test_mode', function () {
        expect(response).to.have.a.property('test_mode');
    });
    it('get_version has property major', function () {
        expect(response).to.have.a.property('major');
    });
    it('get_version has property minor', function () {
        expect(response).to.have.a.property('minor');
    });
    it('get_version has property patch', function () {
        expect(response).to.have.a.property('patch');
    });

    it('device test_mode is enabled', function () {
        expect(response.test_mode).to.be.true;
    });
    it('app has matching version', function () {
        expect(response.major).to.equal(EXPECTED_MAJOR);
        expect(response.minor).to.equal(EXPECTED_MINOR);
        expect(response.patch).to.equal(EXPECTED_PATCH);
    });
});
