// Test-only transport. Production HID and U2F transports are unchanged.
const http = require('http');

class Speculos {
    constructor(url = process.env.SPECULOS_URL || 'http://127.0.0.1:5000') {
        this.url = new URL('/apdu', url);
    }

    setScrambleKey() {}

    exchange(apdu, statuses) {
        return new Promise((resolve, reject) => {
            const body = JSON.stringify({data: apdu});
            const request = http.request(this.url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body)}
            }, response => {
                let data = '';
                response.setEncoding('utf8');
                response.on('data', chunk => { data += chunk; });
                response.on('error', reject);
                response.on('end', () => {
                    try {
                        if (response.statusCode !== 200) throw new Error(`Speculos HTTP ${response.statusCode}: ${data}`);
                        const hex = JSON.parse(data).data;
                        if (typeof hex !== 'string' || !/^(?:[a-f0-9]{2}){2,}$/i.test(hex)) {
                            throw new Error('Invalid Speculos APDU response');
                        }
                        const status = parseInt(hex.slice(-4), 16);
                        // Match the legacy transport's rejection contract.
                        if (!statuses.includes(status)) return reject(`Invalid status ${status.toString(16)}`);
                        resolve(hex);
                    } catch (error) { reject(error); }
                });
            });
            request.setTimeout(30000, () => request.destroy(new Error('Speculos APDU timeout')));
            request.on('error', reject);
            request.end(body);
        });
    }
}

module.exports = Speculos;
