class MentorshipServiceProxy {
    constructor(
        baseUrl = process.env.MENTORSHIP_API_URL || `http://localhost:${process.env.MENTORSHIP_PORT || 8080}`,
        options = {}
    ) {
        this.baseUrl = baseUrl;
        this.maxRetries = options.maxRetries !== undefined
            ? options.maxRetries
            : (process.env.NODE_ENV === 'test' ? 1 : Number(process.env.MENTORSHIP_MAX_RETRIES || 3));
        this.retryDelayMs = options.retryDelayMs !== undefined
            ? options.retryDelayMs
            : (process.env.NODE_ENV === 'test' ? 50 : Number(process.env.MENTORSHIP_RETRY_DELAY_MS || 3000));
        this.timeoutMs = options.timeoutMs || Number(process.env.MENTORSHIP_TIMEOUT_MS || 15000);

        this.inFlightRequests = new Map();
    }

    _sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    _getRequestKey(method, targetUrl, body) {
        return `${method}:${targetUrl.pathname}${targetUrl.search}:${body || ''}`;
    }

    async _fetchWithRetry(targetUrl, method, headers, body) {
        let lastError = null;
        let lastResponse = null;

        for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
            if (attempt > 0) {
                await this._sleep(this.retryDelayMs);
            }

            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

                const response = await fetch(targetUrl, {
                    method,
                    headers,
                    body,
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                const isTransientError = [429, 502, 503, 504].includes(response.status);

                if (isTransientError && attempt < this.maxRetries) {
                    lastResponse = response;
                    continue;
                }

                const headerEntries = [];
                response.headers.forEach((value, key) => {
                    if (!['connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
                        headerEntries.push([key, value]);
                    }
                });

                const buffer = Buffer.from(await response.arrayBuffer());

                return {
                    status: response.status,
                    headers: headerEntries,
                    buffer,
                };
            } catch (error) {
                lastError = error;
                if (attempt >= this.maxRetries) {
                    throw error;
                }
            }
        }

        if (lastResponse) {
            const headerEntries = [];
            lastResponse.headers.forEach((value, key) => {
                if (!['connection', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
                    headerEntries.push([key, value]);
                }
            });
            const buffer = Buffer.from(await lastResponse.arrayBuffer());
            return {
                status: lastResponse.status,
                headers: headerEntries,
                buffer,
            };
        }

        throw lastError || new Error('Falha ao conectar com o serviço de mentoria.');
    }

    async executeRequest(targetUrl, method, headers, body) {
        const key = this._getRequestKey(method, targetUrl, body);

        if (this.inFlightRequests.has(key)) {
            return await this.inFlightRequests.get(key);
        }

        const requestPromise = this._fetchWithRetry(targetUrl, method, headers, body)
            .finally(() => {
                this.inFlightRequests.delete(key);
            });

        this.inFlightRequests.set(key, requestPromise);
        return await requestPromise;
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
            const result = await this.executeRequest(targetUrl, req.method, headers, body);

            res.status(result.status);
            result.headers.forEach(([key, value]) => {
                res.setHeader(key, value);
            });
            res.send(result.buffer);
        } catch (_error) {
            res.status(502).json({ message: 'Serviço de mentoria indisponível.' });
        }
    }
}

module.exports = MentorshipServiceProxy;
