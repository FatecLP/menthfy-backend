class MentorshipServiceProxy {
    constructor(baseUrl = process.env.MENTORSHIP_API_URL || `http://localhost:${process.env.MENTORSHIP_PORT || 8080}`) {
        this.baseUrl = baseUrl;
    }

    async forwardRequest(req, res) {
        const targetUrl = new URL(req.originalUrl, this.baseUrl);
        const headers = new Headers();

        Object.entries(req.headers).forEach(([key, value]) => {
            const normalizedKey = key.toLowerCase();
            if (['host', 'connection', 'content-length', 'origin', 'referer'].includes(normalizedKey)) {
                return;
            }
            if (typeof value === 'string') {
                headers.set(key, value);
            }
        });

        const methodAllowsBody = !['GET', 'HEAD'].includes(req.method);
        const body = methodAllowsBody && req.body && Object.keys(req.body).length > 0
            ? JSON.stringify(req.body)
            : undefined;

        if (body && !headers.has('content-type')) {
            headers.set('content-type', 'application/json');
        }

        try {
            const upstreamResponse = await fetch(targetUrl, {
                method: req.method,
                headers,
                body,
            });

            res.status(upstreamResponse.status);

            upstreamResponse.headers.forEach((value, key) => {
                if (!['connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
                    res.setHeader(key, value);
                }
            });

            const responseBuffer = Buffer.from(await upstreamResponse.arrayBuffer());
            res.send(responseBuffer);
        } catch (error) {
            res.status(502).json({ message: 'Serviço de mentoria indisponível.' });
        }
    }
}

module.exports = MentorshipServiceProxy;
