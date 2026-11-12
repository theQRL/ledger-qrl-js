const assert = require('assert');
const Qrl = require('../src/ledger-qrl');
const Speculos = require('./helpers/speculos');

describe('historical Nano S app on Speculos (SDK 1.5)', function () {
    this.timeout(35000);
    const transport = new Speculos();
    const qrl = new Qrl(transport);

    it('reports the pinned QRL app version and testing mode', async function () {
        const result = await qrl.get_version();
        assert.strictEqual(result.return_code, 0x9000);
        assert.deepStrictEqual([result.major, result.minor, result.patch], [1, 1, 2]);
        assert.strictEqual(result.test_mode, true);
    });

    for (const size of [1, 5, 57, 64, 128, 255]) {
        it(`exchanges ${size} bytes through the real app`, async function () {
            const result = await qrl.test_comm(size);
            assert.strictEqual(result.return_code, 0x9000);
            assert.deepStrictEqual(result.test_answer, Buffer.from(Array.from({length: size}, (_, i) => i + 1)));
        });
    }

    it('reads the app state', async function () {
        const result = await qrl.get_state();
        assert.strictEqual(result.return_code, 0x9000);
        assert(Number.isInteger(result.state));
        assert(Number.isInteger(result.xmss_index));
    });

    it('propagates unsupported instruction status', async function () {
        await assert.rejects(transport.exchange('77ff000000', [0x9000]), error => error === 'Invalid status 6d00');
    });
});
