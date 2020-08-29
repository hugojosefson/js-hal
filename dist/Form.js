"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Form = /** @class */ (function () {
    function Form(key, value) {
        var _this = this;
        this.toRaw = function () {
            var raw = {
                action: _this.action,
                method: _this.method,
                type: _this.type,
                fields: _this.fields,
                error: _this.error,
                text: _this.text,
            };
            return raw;
        };
        if (!key)
            throw new Error('Form requires a key');
        this.key = key;
        if (typeof value != 'object')
            throw new Error('invalid form value');
        if (!value.action)
            throw new Error('Form action URI is required');
        if (!value.method)
            throw new Error('Form method is requied');
        // TODO check that action and method exist in value
        var expectedFormAttributes = ['action', 'method', 'type', 'fields', 'error', 'text'];
        // TODO check that field name and type exists
        var expectedFieldAttributes = ['name', 'type', 'required', 'default', 'regex'];
        for (var attr in value) {
            if (!~expectedFormAttributes.indexOf(attr)) {
                continue;
            }
            this[attr] = value[attr];
        }
    }
    return Form;
}());
exports.default = Form;
