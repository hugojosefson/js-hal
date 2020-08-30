"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Link = /** @class */ (function () {
    function Link(rel, value) {
        var _this = this;
        this.toRaw = function () {
            var raw = Object.keys(_this.attributes).reduce(function (raw, attr) {
                if (_this.attributes[attr]) {
                    raw[attr] = _this.attributes[attr];
                }
                return raw;
            }, { href: _this.attributes.href });
            return raw;
        };
        if (!rel)
            throw new Error('Link requires rel');
        this.rel = rel;
        if (typeof value == 'object') {
            // If value is a hashmap, just copy properties
            if (!value.href)
                throw new Error('Required <link> attribute "href"');
            var expectedAttributes = ['href', 'name', 'hreflang', 'title', 'templated', 'icon', 'align', 'method'];
            for (var attr in value) {
                if (value.hasOwnProperty(attr)) {
                    if (!~expectedAttributes.indexOf(attr)) {
                        // Unexpected attribute: ignore it
                        continue;
                    }
                    this.attributes[attr] = value[attr];
                }
            }
        }
        else {
            // value is a scalar: use its value as href
            if (!value)
                throw new Error('Required <link> attribute "href"');
            this.attributes.href = String(value);
        }
    }
    return Link;
}());
exports.default = Link;
