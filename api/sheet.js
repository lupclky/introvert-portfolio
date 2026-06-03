const DEFAULT_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbykUXBTxed_Slzm5zoI3uX79ciTkuBNrOc3U2JDO-o0dfulpqSO8mLL4dh16847kc_G/exec";

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
            const upstream = await fetch(appsScriptUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body
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
