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
const expect = require('chai').expect;

if (typeof ledger === 'undefined') {
    ledger = require('../src');
    comm = ledger.Comm_node;
    browser = false;
} else {
    browser = true;
    comm = ledger.Comm_u2f;
}

TIMEOUT = 1000;
TIMEOUT_KEYGEN = 25000;
EXPECTED_MAJOR = 0;
EXPECTED_MINOR = 3;
EXPECTED_PATCH = 1;

describe('get_state', function () {
    let response;
    // call API
    before(function () {
        return comm.create_async(TIMEOUT, true).then(
            function (comm) {
                let qrl = new ledger.Qrl(comm);
                return qrl.get_state().then(function (result) {
                    response = result;
                    console.log(response);
                })
            });
    });

    it('return_code is 0x9000', function () {
        expect(response.return_code).to.equal(0x9000);
    });

    it('get_state has property test_mode', function () {
        expect(response);
    });

    it('has property mode', function () {
        expect(response).to.have.a.property('state');
    });
    it('has property xmss_index', function () {
        expect(response).to.have.a.property('xmss_index');
    });
});

describe('publickey', function () {
    let response;
    // call API
    before(function () {
        this.timeout(TIMEOUT_KEYGEN);
        return comm.create_async(TIMEOUT_KEYGEN, true).then(
            function (comm) {
                let qrl = new ledger.Qrl(comm);
                return qrl.publickey().then(function (result) {
                    response = result;
                    console.log(response);
                })
            });
    });
    it('return_code is 0x9000', function () {
        expect(response.return_code).to.equal(0x9000);
    });
});


describe('sign_raw', function () {
    /* ************************************************************** */
    /* ************************************************************** */
    /* ************************************************************** */
    /* USING SIGN SEND IS NOT RECOMMENDED. THIS IS ONLY FOR TESTING */
    /* ************************************************************** */
    /* ************************************************************** */
    /* ************************************************************** */
    let response;

    const basic_tx = Buffer.alloc(96);

    // https://github.com/ZondaX/ledger-qrl-app/blob/e5daec2d4b159ea32665f3e4ac00b6a187364500/src/lib/qrl_types.h
    basic_tx[0] = ledger.QrlConst.QRLTX_TX;
    basic_tx[1] = 1;            // Number of destinations
    // Keep all as zeros

    // call API
    before(function () {
        this.timeout(TIMEOUT_KEYGEN);
        return comm.create_async(TIMEOUT_KEYGEN, true).then(
            function (comm) {
                let qrl = new ledger.Qrl(comm);
                return qrl.signSend(basic_tx).then(function (result) {
                    response = result;
                    console.log(response);
                })
            });
    });
    it('return_code is 0x9000', function () {
        expect(response.return_code).to.equal(0x9000);
    });
});

function getDummyAddr(val){
    let tmp = Buffer.alloc(39);
    for (let i = 0; i<39; i++){
        tmp[i] = val;
    }
    return tmp;
}

describe('sign_retrieve', function () {
    // call API
    let response = {};
    before(function () {
        this.timeout(TIMEOUT_KEYGEN);
        return comm.create_async(TIMEOUT_KEYGEN, true).then(async function (comm) {
            let qrl = new ledger.Qrl(comm);

            // Create a transaction
            let source_addr = getDummyAddr(5);
            let fee = Buffer.from([0,0,0,1,0,0,0,8]);

            let dest_addr = [getDummyAddr(6), getDummyAddr(7)];

            let dest_amount = [
                Buffer.from([0,0,0,0,0,1,0,8]),
                Buffer.from([0,0,0,0,1,0,0,8])];

            let tx = qrl.createTx(source_addr, fee, dest_addr, dest_amount);

            // Send transaction
            response = await qrl.retrieveSignature(tx);
            return response
        });
    });

    it('return_code is 0x9000', function () {
        console.log(response.error_message);
        expect(response.return_code).to.equal(0x9000);
    });
});
