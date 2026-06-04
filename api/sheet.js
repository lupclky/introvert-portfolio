const DEFAULT_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbykUXBTxed_Slzm5zoI3uX79ciTkuBNrOc3U2JDO-o0dfulpqSO8mLL4dh16847kc_G/exec";
const crypto = require("crypto");

function getAppsScriptUrl() {
    return process.env.GOOGLE_APPS_SCRIPT_URL || DEFAULT_APPS_SCRIPT_URL;
}

function sendJson(res, statusCode, data) {
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.end(JSON.stringify(data));
}

async function readBody(req) {
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString("utf8");
}

function sendMissingPrivateConfig(res) {
    return sendJson(res, 500, { error: "Private sheet auth is not configured." });
}

function verifyPrivateToken(req) {
    const secret = process.env.PRIVATE_TOKEN_SECRET;
    if (!secret) return false;

    const header = req.headers.authorization || "";
    const match = header.match(/^Bearer\s+(.+)$/i);
    if (!match) return false;

    const [body, signature] = match[1].split(".");
    if (!body || !signature) return false;

    const expected = crypto.createHmac("sha256", secret).update(body).digest("base64url");
    const left = Buffer.from(signature);
    const right = Buffer.from(expected);
    if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) return false;

    try {
        const payload = JSON.parse(Buffer.from(body.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
        const now = Math.floor(Date.now() / 1000);
        return payload.scope === "private" && payload.exp && payload.exp > now;
    } catch (err) {
        return false;
    }
}

function isPublicPost(data) {
    return (data.type || "article") === "message";
}

module.exports = async function handler(req, res) {
    const appsScriptUrl = getAppsScriptUrl();

    try {
        if (req.method === "GET") {
            const requestUrl = new URL(req.url, `https://${req.headers.host || "localhost"}`);
            const type = requestUrl.searchParams.get("type") || "articles";
            const upstreamUrl = `${appsScriptUrl}?type=${encodeURIComponent(type)}`;
            const upstream = await fetch(upstreamUrl);
            const text = await upstream.text();

            if (!upstream.ok) {
                return sendJson(res, upstream.status, {
                    error: "Apps Script request failed",
                    status: upstream.status,
                    body: text.slice(0, 500)
                });
            }

            try {
                JSON.parse(text);
            } catch (err) {
                return sendJson(res, 502, {
                    error: "Apps Script did not return JSON. Check deployment access: Execute as Me, Who has access Anyone.",
                    body: text.slice(0, 500)
                });
            }

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.setHeader("Cache-Control", "no-store");
            return res.end(text);
        }

        if (req.method === "POST") {
            const body = await readBody(req);
            let data;
            try {
                data = body ? JSON.parse(body) : {};
            } catch (err) {
                return sendJson(res, 400, { error: "Invalid JSON body" });
            }

            if (!isPublicPost(data)) {
                if (!verifyPrivateToken(req)) {
                    return sendJson(res, 401, { success: false, error: "Unauthorized" });
                }

                const sheetAuthHash = process.env.SHEET_AUTH_HASH || process.env.PRIVATE_PASSCODE_HASH;
                if (!sheetAuthHash) return sendMissingPrivateConfig(res);
                data.auth = sheetAuthHash;
            }

            const upstream = await fetch(appsScriptUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const text = await upstream.text();

            if (!upstream.ok) {
                return sendJson(res, upstream.status, {
                    error: "Apps Script request failed",
                    status: upstream.status,
                    body: text.slice(0, 500)
                });
            }

            try {
                return sendJson(res, 200, JSON.parse(text));
            } catch (err) {
                return sendJson(res, 200, { success: true });
            }
        }

        res.setHeader("Allow", "GET, POST");
        return sendJson(res, 405, { error: "Method not allowed" });
    } catch (err) {
        return sendJson(res, 500, {
            error: err.message || "Unexpected proxy error"
        });
    }
};
