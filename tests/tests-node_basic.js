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
TIMEOUT_KEYGEN = 15000;
EXPECTED_MAJOR = 0;
EXPECTED_MINOR = 3;
EXPECTED_PATCH = 1;

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
                    });
                });
        });
    it('return_code is 0x9000', function () {
        expect(response.return_code).to.equal(0x9000);
    });
    it('has property test_mode', function () {
        expect(response).to.have.a.property('test_mode');
    });
    it('has property major', function () {
        expect(response).to.have.a.property('major');
    });
    it('has property minor', function () {
        expect(response).to.have.a.property('minor');
    });
    it('has property patch', function () {
        expect(response).to.have.a.property('patch');
    });
    it('test_mode is enabled', function () {
        expect(response.test_mode).to.be.true;
    });
    it('app has matching version', function () {
        expect(response.major).to.equal(EXPECTED_MAJOR);
        expect(response.minor).to.equal(EXPECTED_MINOR);
        expect(response.patch).to.equal(EXPECTED_PATCH);
    });
});

describe('test_comm(5)', function () {
    let response;
    // call API
    before(function () {
        return comm.create_async(TIMEOUT, true).then(
            function (comm) {
                let qrl = new ledger.qrl(comm);
                return qrl.test_comm(5).then(function (result) {
                    response = result;
                    console.log(response);
                })
            });
    });
    it('return_code is 0x9000', function () {
        expect(response.return_code).to.equal(0x9000);
    });
    it('has property test_answer', function () {
        expect(response).to.have.a.property('test_answer');
    });
    it('has property test_answer', function () {
        expect(response).to.have.a.property('test_answer');
    });
    it('answer is a sequence of size 5', function () {
        console.log(response);
        expect(response.test_answer).to.eql(Buffer.from([1, 2, 3, 4, 5]));
    });
});
