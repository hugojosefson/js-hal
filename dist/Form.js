"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Form(key, value) {
    if (!(this instanceof Form))
        return new Form(key, value);
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
    var expectedFormAttributes = ['action', 'method', 'type', 'fields'];
    // TODO check that field name and type exists
    var expectedFieldAttributes = ['name', 'type', 'required', 'default', 'regex'];
    for (var attr in value) {
        if (!~expectedFormAttributes.indexOf(attr)) {
            continue;
        }
        this[attr] = value[attr];
    }
}
exports.default = Form;
Form.prototype.toJSON = function () {
    // Note: calling "JSON.stringify(this)" will fail as JSON.stringify itself calls toJSON()
    // We need to copy properties to a new object
    return Object.keys(this).reduce((function (object, key) {
        object[key] = this[key];
        return object;
    }).bind(this), {});
};
