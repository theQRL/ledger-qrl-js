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

let Q = require('q');
let QRL = require('./ledger-qrl-consts');

let LedgerQrl = function (comm) {
    this.comm = comm;
    this.comm.setScrambleKey('QRL');
};

function serialize(CLA, INS, p1 = 0, p2 = 0, data = null) {
    var size = 5;
    if (data != null) {
        if (data.length > 255) {
            throw new Error('maximum data size = 255');
        }
        size += data.length
    }

    var buffer = Buffer.alloc(size);
    buffer[0] = CLA;
    buffer[1] = INS;
    buffer[2] = p1;
    buffer[3] = p2;
    buffer[4] = 0;

    if (data != null) {
        buffer[4] = data.length;
        buffer.set(data, 5);
    }

    return buffer;
}

function concatenateTypedArrays (resultConstructor, ...arrays) {
    let totalLength = 0
    for (let arr of arrays) {
      totalLength += arr.length
    }
    let result = new resultConstructor(totalLength)
    let offset = 0
    for (let arr of arrays) {
      result.set(arr, offset)
      offset += arr.length
    }
    return result
}

function errorMessage(error_code) {
    switch (error_code) {
        case 0x9000:
            return "No errors";
        case 0x9001:
            return "Device is busy";
        case 0x6400:
            return "Execution Error";
        case 0x6700:
            return "Wrong Length";
        case 0x6982:
            return "Empty Buffer";
        case 0x6983:
            return "Output buffer too small";
        case 0x6984:
            return "Data is invalid";
        case 0x6985:
            return "Conditions not satisfied";
        case 0x6986:
            return "Command not allowed";
        case 0x6A80:
            return "Bad key handle";
        case 0x6B00:
            return "Invalid P1/P2";
        case 0x6D00:
            return "Instruction not supported";
        case 0x6E00:
            return "CLA not supported";
        case 0x6F00:
            return "Unknown error";
        case 0x6F01:
            return "Sign/verify error";
        default:
            return "Unknown error code";
    }
}

LedgerQrl.prototype.get_version = function () {
    let buffer = serialize(
        QRL.CLA,
        QRL.INS_VERSION, 0, 0);

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
            result["error_message"] = errorMessage(result["return_code"]);
            return result;
        },
        function (response) {
            let result = {};
            // Unfortunately, ledger returns an string!! :(
            result["return_code"] = parseInt(response.slice(-4), 16);
            result["error_message"] = errorMessage(result["return_code"]);
            return result;
        });
};

LedgerQrl.prototype.get_state = function () {
    let buffer = serialize(
        QRL.CLA,
        QRL.INS_GETSTATE, 0, 0);

    return this.comm.exchange(buffer.toString('hex'), [0x9000]).then(
        function (apduResponse) {
            var result = {};
            apduResponse = Buffer.from(apduResponse, 'hex');
            let error_code_data = apduResponse.slice(-2);

            result["state"] = apduResponse[0]; // 0 - Not ready, 1 - generating keys, 2 = ready
            result["xmss_index"] = apduResponse[2] + apduResponse[1] * 256;
            result["return_code"] = error_code_data[0] * 256 + error_code_data[1];
            result["error_message"] = errorMessage(result["return_code"]);

            return result;
        },
        function (response) {
            let result = {};
            // Unfortunately, ledger returns an string!! :(
            result["return_code"] = parseInt(response.slice(-4), 16);
            result["error_message"] = errorMessage(result["return_code"]);
            return result;
        });
};

LedgerQrl.prototype.publickey = function () {
    let buffer = serialize(
        QRL.CLA,
        QRL.INS_PUBLIC_KEY);

    return this.comm.exchange(buffer.toString('hex'), [0x9000]).then(
        function (apduResponse) {
            var result = {};
            apduResponse = Buffer.from(apduResponse, 'hex');
            let error_code_data = apduResponse.slice(-2);

            result["public_key"] = apduResponse.slice(0, apduResponse.length - 2);
            result["return_code"] = error_code_data[0] * 256 + error_code_data[1];
            result["error_message"] = errorMessage(result["return_code"]);

            return result;
        });
};

LedgerQrl.prototype.signSend = function (message) {
    let buffer = serialize(
        QRL.CLA,
        QRL.INS_SIGN, 0, 0, message);

    return this.comm.exchange(buffer.toString('hex'), [0x9000]).then(
        function (apduResponse) {
            var result = {};
            apduResponse = Buffer.from(apduResponse, 'hex');
            let error_code_data = apduResponse.slice(-2);

            result["signature_chunk"] = apduResponse.slice(0, apduResponse.length - 2);
            result["return_code"] = error_code_data[0] * 256 + error_code_data[1];
            result["error_message"] = errorMessage(result["return_code"]);

            return result;
        },
        function (response) {
            let result = {};
            // Unfortunately, ledger returns an string!! :(
            result["return_code"] = parseInt(response.slice(-4), 16);
            result["error_message"] = errorMessage(result["return_code"]);
            return result;
        });
};

LedgerQrl.prototype.signNext = function () {
    let buffer = serialize(
        QRL.CLA,
        QRL.INS_SIGN_NEXT);

    return this.comm.exchange(buffer.toString('hex'), [0x9000]).then(
        function (apduResponse) {
            var result = {};
            apduResponse = Buffer.from(apduResponse, 'hex');
            let error_code_data = apduResponse.slice(-2);

            result["signature_chunk"] = apduResponse.slice(0, apduResponse.length - 2);
            result["return_code"] = error_code_data[0] * 256 + error_code_data[1];
            result["error_message"] = errorMessage(result["return_code"]);

            console.log('apduResponse')
            console.log(apduResponse)
            console.log(result)

            return result;
        },
        function (response) {
            let result = {};
            // Unfortunately, ledger returns an string!! :(
            result["return_code"] = parseInt(response.slice(-4), 16);
            result["error_message"] = errorMessage(result["return_code"]);
            return result;
        });
};

LedgerQrl.prototype.setIdx = function (idx) {
    let buffer = serialize(
        QRL.CLA,
        QRL.INS_SETIDX, 0, 0, idx);

    console.log('send idx')
    console.log(buffer.toString('hex'))

    return this.comm.exchange(buffer.toString('hex'), [0x9000]).then(
        function (apduResponse) {
            var result = {};
            apduResponse = Buffer.from(apduResponse, 'hex');

            let error_code_data = apduResponse.slice(-2);

            result["signature_chunk"] = apduResponse.slice(0, apduResponse.length - 2);
            result["return_code"] = error_code_data[0] * 256 + error_code_data[1];
            result["error_message"] = errorMessage(result["return_code"]);

            console.log('apduResponse')
            console.log(apduResponse)
            console.log(result)

            return result;
        },
        function (response) {
            let result = {};
            // Unfortunately, ledger returns an string!! :(
            result["return_code"] = parseInt(response.slice(-4), 16);
            result["error_message"] = errorMessage(result["return_code"]);
            return result;
        });
};

LedgerQrl.prototype.test_comm = function (count) {
    let buffer = serialize(
        QRL.CLA,
        QRL.INS_TEST_COMM, count);

    return this.comm.exchange(buffer.toString('hex'), [0x9000]).then(
        function (apduResponse) {
            var result = {};
            apduResponse = Buffer.from(apduResponse, 'hex');
            let error_code_data = apduResponse.slice(-2);

            result["test_answer"] = apduResponse.slice(0, apduResponse.length - 2);
            result["return_code"] = error_code_data[0] * 256 + error_code_data[1];
            result["error_message"] = errorMessage(result["return_code"]);

            return result;
        },
        function (response) {
            let result = {};
            // Unfortunately, ledger returns an string!! :(
            result["return_code"] = parseInt(response.slice(-4), 16);
            result["error_message"] = errorMessage(result["return_code"]);
            return result;
        });
};

LedgerQrl.prototype.retrieveSignature = async function (transaction) {
    let myqrl = this;
    return myqrl.signSend(transaction).then(async function (result) {
        let response = {};

        response["return_code"] = result.return_code;
        response["error_message"] = result.error_message;
        response["signature"] = null;

        if (result.return_code === QRL.APDU_ERROR_CODE_OK) {
            let signature = new Uint8Array()
            for (let i = 0; i < 11; i++) {
                result = await myqrl.signNext();
                if (result.return_code !== QRL.APDU_ERROR_CODE_OK) {
                    response["return_code"] = result.return_code;
                    response["error_message"] = result.error_message;
                    break;
                }

                signature = concatenateTypedArrays(
                    Uint8Array,
                        signature,
                        result.signature_chunk
                );
                response = result;
            }
            response["return_code"] = result.return_code;
            response["error_message"] = result.error_message;
            response["signature"] = signature;
        }

        return response;
    })
};

LedgerQrl.prototype.createTx = function (source_address, fee, dest_addresses, dest_amounts) {
    // https://github.com/ZondaX/ledger-qrl-app/src/lib/qrl_types.h

    // Verify that sizes are valid
    if (source_address.length !== QRL.P_TX_ADDRESS_SIZE) {
        throw Error("Source address length invalid")
    }

    if (fee.length !== 8) {
        throw Error("fee should be 8 bytes")
    }

    if (dest_addresses.length !== dest_amounts.length) {
        throw Error("dest addresses and amount should have the same number of items")
    }

    if (dest_addresses.length > 3) {
        throw Error("maximum supported number of destinations is 3")
    }

    for (let i = 0; i < dest_addresses.length; i++) {
        if (dest_addresses[i].length !== QRL.P_TX_ADDRESS_SIZE) {
            throw Error("Destination address length invalid")
        }
        if (dest_amounts[i].length !== 8) {
            throw Error("each dest_amount should be 8 bytes")
        }
    }

    // Define buffer size
    var num_dest = dest_addresses.length;
    let tx = Buffer.alloc(2 + 47 * (1 + num_dest));

    tx[QRL.P_TX_TYPE] = QRL.QRLTX_TX;
    tx[QRL.P_TX_NUM_DEST] = num_dest;

    source_address.copy(tx, QRL.P_TX_SRC_ADDR);
    fee.copy(tx, QRL.P_TX_SRC_FEE);

    let offset = QRL.P_TX_DEST;
    for (let i = 0; i < dest_addresses.length; i++) {
        dest_addresses[i].copy(tx, offset);
        offset += QRL.P_TX_ADDRESS_SIZE;
        dest_amounts[i].copy(tx, offset);
        offset += 8;
    }

    return tx;
};

LedgerQrl.prototype.createMessageTx = function (source_address, fee, message) {
    // https://github.com/ZondaX/ledger-qrl-app/src/lib/qrl_types.h

    // Verify that sizes are valid
    if (source_address.length !== QRL.P_TX_ADDRESS_SIZE) {
        throw Error("Source address length invalid")
    }

    if (fee.length !== 8) {
        throw Error("fee should be 8 bytes")
    }

    if (message.length > QRL.P_TX_MAX_MESSAGE_SIZE) {
        throw Error("Message length exceed maximum size")
    }

    // Define buffer size
    var num_dest = 1;
    let tx = Buffer.alloc(2 + 47 + (message.length));

    tx[QRL.P_TX_TYPE] = QRL.QRLTX_MESSAGE;
    tx[QRL.P_TX_NUM_DEST] = num_dest;

    source_address.copy(tx, QRL.P_TX_SRC_ADDR);
    fee.copy(tx, QRL.P_TX_SRC_FEE);

    let offset = message.length
    message.copy(tx, offset)

    return tx;
};

module.exports = LedgerQrl;
