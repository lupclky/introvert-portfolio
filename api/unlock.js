const crypto = require("crypto");

function sendJson(res, statusCode, data) {
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.end(JSON.stringify(data));
}

async function readJson(req) {
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(Buffer.from(chunk));
    }
    const text = Buffer.concat(chunks).toString("utf8");
    return text ? JSON.parse(text) : {};
}

function base64url(input) {
    return Buffer.from(input)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

function sha256(value) {
    return crypto.createHash("sha256").update(String(value), "utf8").digest("hex");
}

function signToken(payload, secret) {
    const body = base64url(JSON.stringify(payload));
    const signature = crypto.createHmac("sha256", secret).update(body).digest("base64url");
    return `${body}.${signature}`;
}

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return sendJson(res, 405, { success: false, error: "Method not allowed" });
    }

    const expectedHash = process.env.PRIVATE_PASSCODE_HASH;
    const tokenSecret = process.env.PRIVATE_TOKEN_SECRET;

    if (!expectedHash || !tokenSecret) {
        return sendJson(res, 500, { success: false, error: "Private unlock is not configured." });
    }

    try {
        const data = await readJson(req);
        const passcode = String(data.passcode || "");
        if (!passcode || sha256(passcode) !== expectedHash) {
            return sendJson(res, 401, { success: false, error: "Unauthorized" });
        }

        const now = Math.floor(Date.now() / 1000);
        const token = signToken({
            scope: "private",
            iat: now,
            exp: now + 60 * 60 * 4
        }, tokenSecret);

        return sendJson(res, 200, { success: true, token });
    } catch (err) {
        return sendJson(res, 400, { success: false, error: "Invalid request" });
    }
};
