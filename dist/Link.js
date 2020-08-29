"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Link = /** @class */ (function () {
    function Link(rel, value) {
        var _this = this;
        this.toRaw = function () {
            var raw = {
                href: _this.href,
                templated: _this.templated,
                type: _this.type,
                name: _this.name,
                profile: _this.profile,
                title: _this.title,
                hreflang: _this.hreflang,
            };
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
                    this[attr] = value[attr];
                }
            }
        }
        else {
            // value is a scalar: use its value as href
            if (!value)
                throw new Error('Required <link> attribute "href"');
            this.href = String(value);
        }
    }
    return Link;
}());
exports.default = Link;
