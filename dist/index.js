"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const createClient = () => {
    const init = {
        method: 'GET',
        headers: new Headers(),
    };
    let baseUrl = '';
    const request = (url, _config = {}, method = 'GET') => {
        init.method = method;
        const input = url instanceof URL ? url.toString() : baseUrl + url;
        return fetch(input, init).then(utils_1.parseResponse);
    };
    const createMethod = (method) => (url, config = {}) => request(url, config, method);
    const createMutationMethod = (method) => {
        return (url, data, config = {}) => {
            if (data) {
                init.body = JSON.stringify(data);
                init.headers.append('Content-Type', 'application/json');
            }
            return request(url, config, method);
        };
    };
    const post = createMutationMethod('POST');
    const patch = createMutationMethod('PATCH');
    const put = createMutationMethod('PUT');
    const del = createMethod('DELETE');
    const head = createMethod('HEAD');
    const options = createMethod('OPTIONS');
    const get = (url, config = {}) => {
        const urlObj = new URL(baseUrl + url);
        if (config.params)
            urlObj.search = new URLSearchParams(config.params).toString();
        return request(urlObj);
    };
    function create(base) {
        baseUrl = base;
        return this;
    }
    return {
        get,
        post,
        patch,
        put,
        delete: del,
        head,
        options,
        create,
    };
};
const x = createClient();
exports.default = x;
//# sourceMappingURL=index.js.map