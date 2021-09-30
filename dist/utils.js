"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResponse = void 0;
function pick(object, props) {
    return props.reduce((acc, k) => ({ ...acc, [k]: object[k] }), {});
}
const parseBody = async (res) => {
    const contentType = res.headers.get('content-type');
    if (contentType === null || contentType === void 0 ? void 0 : contentType.includes('application/json')) {
        return res.json();
    }
    return res;
};
const parseResponse = async (res) => {
    const parsed = {
        ...pick(res, ['status', 'statusText']),
        headers: Object.fromEntries(res.headers.entries()),
        data: await parseBody(res),
    };
    if (res.ok)
        return parsed;
    return Promise.reject({
        response: parsed,
    });
};
exports.parseResponse = parseResponse;
//# sourceMappingURL=utils.js.map