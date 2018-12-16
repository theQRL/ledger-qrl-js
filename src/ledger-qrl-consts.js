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

module.exports = {
    CLA: 0x77,

    // Instructions
    INS_VERSION: 0x00,
    INS_GETSTATE: 0x01,
    INS_PUBLIC_KEY: 0x03,
    INS_SIGN: 0x04,
    INS_SIGN_NEXT: 0x05,
    INS_SETIDX: 0x06,

    // Test instructions
    /* These instructions are only enabled in test mode */
    INS_TEST_PK_GEN_1: 0x80,
    INS_TEST_PK_GEN_2: 0x81,
    INS_TEST_CALC_PK: 0x82,
    INS_TEST_WRITE_LEAF: 0x83,
    INS_TEST_READ_LEAF: 0x84,
    INS_TEST_KEYGEN: 0x85,
    INS_TEST_DIGEST: 0x86,
    INS_TEST_SETSTATE: 0x87,
    INS_TEST_COMM: 0x88,

    // APDU ERRORS
    APDU_ERROR_CODE_OK: 0x9000,

    QRLTX_TX: 0,
    QRLTX_TXTOKEN: 1,
    QRLTX_SLAVE: 2,
    QRLTX_MESSAGE: 3,

    // Based on https://github.com/ZondaX/ledger-qrl-app/src/lib/qrl_types.h
    P_TX_ADDRESS_SIZE : 39,

    P_TX_TYPE : 0,
    P_TX_NUM_DEST : 1,
    P_TX_SRC_ADDR : 2,
    P_TX_SRC_FEE : 41,
    P_TX_DEST : 49

};
