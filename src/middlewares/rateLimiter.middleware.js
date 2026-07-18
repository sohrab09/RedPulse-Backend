const requestStore = new Map();
const MAX_REQUESTS = 5;
const BLOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes
const WINDOW_DURATION_MS = 60 * 60 * 1000; // 1 hour

function getClientIdentifier(req) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    return `${ip}:${userAgent}`;
}

function rateLimiter(req, res, next) {
    const identifier = getClientIdentifier(req);
    const now = Date.now();

    // Check if blocked
    const blocked = requestStore.get(`blocked:${identifier}`);
    if (blocked && now < blocked.until) {
        const remainingMs = blocked.until - now;
        const remainingMin = Math.ceil(remainingMs / 60000);

        return res.status(429).json({
            success: false,
            message: `Too many requests. You are blocked for ${remainingMin} more minute${remainingMin > 1 ? 's' : ''}.`,
            retryAfter: Math.ceil(remainingMs / 1000)
        });
    }

    // Clean expired block
    if (blocked) {
        requestStore.delete(`blocked:${identifier}`);
    }

    // Get request count
    let data = requestStore.get(`requests:${identifier}`);

    if (!data || (now - data.firstRequest) > WINDOW_DURATION_MS) {
        data = { count: 0, firstRequest: now };
    }

    // Check limit
    if (data.count >= MAX_REQUESTS) {
        // Block for 10 minutes
        requestStore.set(`blocked:${identifier}`, {
            until: now + BLOCK_DURATION_MS,
            blockedAt: now
        });
        requestStore.delete(`requests:${identifier}`);

        return res.status(429).json({
            success: false,
            message: `Limit exceeded: ${MAX_REQUESTS} requests per hour. Please try again after 10 minutes.`,
            retryAfter: BLOCK_DURATION_MS / 1000
        });
    }

    // Increment
    data.count++;
    requestStore.set(`requests:${identifier}`, data);

    next();
}

// Cleanup every 30 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of requestStore.entries()) {
        const expiry = key.startsWith('blocked:') ? value.until : value.firstRequest + WINDOW_DURATION_MS;
        if (now > expiry) {
            requestStore.delete(key);
        }
    }
}, 30 * 60 * 1000);

module.exports = rateLimiter;