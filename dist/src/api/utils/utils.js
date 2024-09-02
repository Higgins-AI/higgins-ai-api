"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = void 0;
const ssr_1 = require("@supabase/ssr");
const createClient = (context, token) => {
    return (0, ssr_1.createServerClient)(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
        global: {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        },
        cookies: {
            get: (key) => {
                var _a;
                if (!key)
                    return;
                const cookies = context.req.cookies;
                const cookie = (_a = cookies[key]) !== null && _a !== void 0 ? _a : "";
                if (!cookie)
                    return;
                return decodeURIComponent(cookie);
            },
            set: (key, value, options) => {
                if (!context.res)
                    return;
                context.res.cookie(key, encodeURIComponent(value), Object.assign(Object.assign({}, options), { sameSite: "Lax", httpOnly: true }));
            },
            remove: (key, options) => {
                if (!context.res)
                    return;
                context.res.cookie(key, "", Object.assign(Object.assign({}, options), { httpOnly: true }));
            },
        },
    });
};
exports.createClient = createClient;
