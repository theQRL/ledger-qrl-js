const assert = require('assert');
const ledger = require('../src');

describe('package and QRL protocol', function () {
    it('loads the public entry point and native HID dependency', function () {
        assert.strictEqual(typeof ledger.Comm_node.create_async, 'function');
        assert.strictEqual(typeof ledger.Comm_u2f.create_async, 'function');
        assert.strictEqual(typeof require('node-hid').devices, 'function');
    });

    it('sends the version APDU and parses its response', async function () {
        const qrl = new ledger.qrl({
            setScrambleKey(key) { assert.strictEqual(key, 'QRL'); },
            exchange(hex, statuses) {
                assert.strictEqual(hex, '7700000000');
                assert.deepStrictEqual(statuses, [0x9000]);
                return Promise.resolve('000101029000');
            }
        });
        assert.deepStrictEqual(await qrl.get_version(), {
            test_mode: false, major: 1, minor: 1, patch: 2,
            return_code: 0x9000, error_message: 'No errors'
        });
    });

    it('preserves device error status', async function () {
        const qrl = new ledger.qrl({setScrambleKey() {}, exchange: () => Promise.reject('Invalid status 6986')});
        assert.deepStrictEqual(await qrl.publickey(), {return_code: 0x6986, error_message: 'Command not allowed'});
    });

    const qrl = new ledger.qrl({setScrambleKey() {}});
    it('serializes a transfer in the legacy wire format', function () {
        const tx = qrl.createTx(Buffer.alloc(39, 1), Buffer.alloc(8, 2), [Buffer.alloc(39, 3)], [Buffer.alloc(8, 4)]);
        assert.strictEqual(tx.toString('hex'), '0001' + '01'.repeat(39) + '02'.repeat(8) + '03'.repeat(39) + '04'.repeat(8));
    });
    it('serializes a message in the legacy wire format', function () {
        const tx = qrl.createMessageTx(Buffer.alloc(39, 1), Buffer.alloc(8, 2), Buffer.from('hello'));
        assert.strictEqual(tx.toString('hex'), '0305' + '01'.repeat(39) + '02'.repeat(8) + '68656c6c6f');
    });
    it('rejects invalid transaction sizes', function () {
        assert.throws(() => qrl.createTx(Buffer.alloc(38), Buffer.alloc(8), [], []), /Source address/);
        assert.throws(() => qrl.createMessageTx(Buffer.alloc(39), Buffer.alloc(8), Buffer.alloc(81)), /maximum size/);
    });
});

describe('legacy HID framing', function () {
    for (const size of [4, 57, 58, 128, 255]) {
        it(`reassembles a ${size}-byte response`, async function () {
            const response = Buffer.concat([Buffer.alloc(size, 0xab), Buffer.from('9000', 'hex')]);
            const packets = [];
            let offset = 0;
            for (let sequence = 0; offset < response.length; sequence++) {
                const packet = Buffer.alloc(64);
                packet.writeUInt16BE(0x0101, 0);
                packet[2] = 5;
                packet.writeUInt16BE(sequence, 3);
                const start = sequence === 0 ? 7 : 5;
                if (sequence === 0) packet.writeUInt16BE(response.length, 5);
                offset += response.copy(packet, start, offset, offset + 64 - start);
                packets.push(packet);
            }
            const writes = [];
            const device = {
                write(data) { writes.push(Buffer.from(data)); },
                read(callback) { setImmediate(() => callback(null, Array.from(packets.shift()))); }
            };
            const comm = new ledger.Comm_node(device, true, 1000, false);
            assert.strictEqual(await comm.exchange('7700000000', [0x9000]), response.toString('hex'));
            assert.strictEqual(writes.length, 1);
            assert.strictEqual(writes[0].length, 65);
            assert.strictEqual(writes[0].subarray(0, 13).toString('hex'), '00010105000000057700000000');
        });
    }
});
