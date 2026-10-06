const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const MentorshipServiceProxy = require('../src/infrastructure/http/MentorshipServiceProxy');

function createMockUpstreamServer(handler) {
    return new Promise((resolve) => {
        const server = http.createServer(handler);
        server.listen(0, '127.0.0.1', () => {
            const { port } = server.address();
            resolve({
                server,
                url: `http://127.0.0.1:${port}`
            });
        });
    });
}

test('MentorshipServiceProxy - retenta após 429 de cold start e obtém sucesso', async () => {
    let callCount = 0;
    const { server, url } = await createMockUpstreamServer((req, res) => {
        callCount++;
        if (callCount === 1) {
            res.writeHead(429, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Cold start / Rate limited' }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify([{ id: 1, status: 'ACCEPTED' }]));
        }
    });

    try {
        const proxy = new MentorshipServiceProxy(url, { maxRetries: 2, retryDelayMs: 20 });
        const req = {
            originalUrl: '/api/mentorships/student/1',
            method: 'GET',
            headers: {}
        };
        let sentStatus = null;
        let sentBody = null;
        const res = {
            status: (s) => { sentStatus = s; return res; },
            setHeader: () => {},
            send: (b) => { sentBody = b; }
        };

        await proxy.forwardRequest(req, res);

        assert.equal(callCount, 2);
        assert.equal(sentStatus, 200);
        assert.deepEqual(JSON.parse(sentBody.toString()), [{ id: 1, status: 'ACCEPTED' }]);
    } finally {
        server.close();
    }
});

test('MentorshipServiceProxy - Single-Flight (Request Coalescing) dispara apenas 1 requisição para chamadas paralelas', async () => {
    let upstreamCallCount = 0;
    const { server, url } = await createMockUpstreamServer((req, res) => {
        upstreamCallCount++;
        setTimeout(() => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'OK', data: [1, 2, 3] }));
        }, 100);
    });

    try {
        const proxy = new MentorshipServiceProxy(url, { maxRetries: 1, retryDelayMs: 10 });
        const req = {
            originalUrl: '/api/mentorships/teacher/1',
            method: 'GET',
            headers: {}
        };

        const responses = [];
        const promises = [1, 2, 3].map(() => {
            let sentStatus = null;
            let sentBody = null;
            const res = {
                status: (s) => { sentStatus = s; return res; },
                setHeader: () => {},
                send: (b) => { sentBody = b; }
            };
            return proxy.forwardRequest(req, res).then(() => {
                responses.push({ status: sentStatus, body: sentBody.toString() });
            });
        });

        await Promise.all(promises);

        assert.equal(upstreamCallCount, 1, 'Deveria ter disparado exatamente 1 chamada upstream compartilhada');
        assert.equal(responses.length, 3);
        responses.forEach((r) => {
            assert.equal(r.status, 200);
            assert.deepEqual(JSON.parse(r.body), { status: 'OK', data: [1, 2, 3] });
        });
    } finally {
        server.close();
    }
});
