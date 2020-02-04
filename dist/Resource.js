"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Link_1 = require("./Link");
var Form_1 = require("./Form");
var helpers_1 = require("./helpers");
var Resource = /** @class */ (function () {
    /**
     * A hypertext resource
     * @param Object object → the base properties
     *                      Define "href" if you choose not to pass parameter "uri"
     *                      Do not define "_links" and "_embedded" unless you know what you're doing
     * @param String uri → href for the <link rel="self"> (can use reserved "href" property instead)
     */
    function Resource(object, uri) {
        this._links = {};
        this._embedded = {};
        this._forms = {};
        // Initialize _links and _embedded properties
        this._links = {};
        this._embedded = {};
        this._forms = {};
        this._props = {};
        if (!object) {
            throw new Error('Invalid object');
        }
        if (object._links) {
            this._links = object._links;
            delete object._links;
        }
        if (object._embedded) {
            this._embedded = object._embedded;
            delete object._embedded;
        }
        // Copy properties from object
        // we copy AFTER initializing _links and _embedded so that user
        // **CAN** (but should not) overwrite them
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                this._props[property] = object[property];
            }
        }
        // Use uri or object.href to initialize the only required <link>: rel = self
        uri = uri || this.href;
        if (uri === this.href) {
            delete this.href;
        }
        // If we have a URI, add this link
        // If not, we won't have a valid object (this may lead to a fatal error later)
        if (uri)
            this.link('self', uri);
        this.toJSON = this.toJSON.bind(this);
    }
    Resource.prototype.link = function (rel, value) {
        var link = new Link_1.default(rel, value);
        var _links = this._links[link.rel];
        if (typeof _links === "undefined") {
            this._links[link.rel] = link;
        }
        else if (Array.isArray(_links)) {
            _links.push(link);
        }
        else {
            this._links[link.rel] = [this._links[link.rel], link];
        }
        return this;
    };
    ;
    Resource.prototype.form = function (key, value) {
        var form = new Form_1.default(key, value);
        var _forms = this._forms[form.key];
        if (typeof this._forms[form.key] === "undefined") {
            this._forms[form.key] = form;
        }
        else if (Array.isArray(_forms)) {
            _forms.push(form);
        }
        else {
            this._forms[form.key] = [this._forms[form.key], form];
        }
        return this;
    };
    /**
     * Add an embedded resource
     * @param String rel → the relation identifier (should be plural)
     * @param Resource|Resource[] → resource(s) to embed
     */
    Resource.prototype.embed = function (rel, resource) {
        var _embedded = this._embedded[rel];
        // Append resource(s)
        if (Array.isArray(resource)) {
            resource = resource.map(function (object) {
                return isResource(object) ? object : new Resource(object);
            });
            if (_embedded && Array.isArray(_embedded)) {
                _embedded = _embedded.concat(resource);
            }
            else if (!_embedded) {
                _embedded = resource;
            }
        }
        else {
            _embedded = isResource(resource) ? resource : new Resource(resource);
        }
        this._embedded[rel] = _embedded;
        return this;
    };
    ;
    /**
     * JSON representation of the resource
     * Requires "JSON.stringify()"
     * @param String indent → how you want your JSON to be indented
     */
    Resource.prototype.toJSON = function () {
        var _this = this;
        var result = {};
        for (var prop in this._props) {
            if (this._props.hasOwnProperty(prop)) {
                result[prop] = this._props[prop];
            }
        }
        if (Object.keys(this._links).length > 0) {
            // Note: we need to copy data to remove "rel" property without corrupting original Link object
            result._links = Object.keys(this._links)
                .reduce(function (links, rel) {
                var _links = _this._links[rel];
                var isArray = function (arg) { return Array.isArray(arg); };
                if (isArray(_links)) {
                    links[rel] = new Array();
                    for (var i = 0; i < _links.length; i++)
                        links[rel].push(_links[i].toJSON());
                }
                else {
                    var link = _links.toJSON();
                    links[rel] = link;
                    delete link.rel;
                }
                return links;
            }, {});
        }
        if (Object.keys(this._embedded).length > 0) {
            result._embedded = {};
            for (var rel in this._embedded) {
                var embedded = this._embedded[rel];
                result._embedded[rel] = Array.isArray(embedded) ?
                    embedded.map(function (embedded) { return embedded.toJSON(); }) :
                    embedded.toJSON();
            }
        }
        if (Object.keys(this._forms).length > 0) {
            result._forms = Object.keys(this._forms)
                .reduce(function (forms, rel) {
                var _forms = _this._forms[rel];
                var isArray = function (arg) { return Array.isArray(arg); };
                if (isArray(_forms)) {
                    forms[rel] = new Array();
                    for (var i = 0; i < _forms.length; i++)
                        forms[rel].push(_forms[i].toJSON());
                }
                else {
                    var form = _forms.toJSON();
                    forms[rel] = form;
                    delete form.rel;
                }
                return forms;
            }, {});
        }
        return result;
    };
    ;
    /**
     * XML representation of the resource
     * @param String indent → how you want your XML to be indented
     */
    Resource.prototype.toXML = function (rel, indent) {
        if (indent === void 0) { indent = ''; }
        // Do not add line feeds if no indentation is asked
        var LF = indent ? '\n' : '';
        // Resource tag
        var xml = indent + '<resource';
        // Resource attributes: rel, href, name
        if (rel)
            xml += ' rel="' + helpers_1.escapeXml(rel) + '"';
        if (this.href || this._links.self)
            xml += ' href="' + helpers_1.escapeXml(this.href || this._links.self.href) + '"';
        //@ts-ignore
        if (this.name)
            xml += ' name="' + helpers_1.escapeXml(this.name) + '"';
        xml += '>' + LF;
        // Add <link> tags
        for (var rel in this._links) {
            if (!this.href && rel === 'self')
                continue;
            xml += indent + this._links[rel].toXML() + LF;
        }
        // Add embedded
        for (var embed in this._embedded) {
            // [Naive singularize](https://github.com/naholyr/js-hal#why-this-crappy-singularplural-management%E2%80%AF)
            var rel = embed.replace(/s$/, '');
            //@ts-ignore
            this._embedded[embed].forEach(function (res) {
                xml += this.toXML(res, rel, indent, indent) + LF;
            });
        }
        // Add properties as tags
        for (var prop in this) {
            if (this.hasOwnProperty(prop) && prop !== '_links' && prop !== '_embedded') {
                xml += indent + '<' + prop + '>' + String(this[prop]) + '</' + prop + '>' + LF;
            }
        }
        // Close tag and return the shit
        xml += indent + '</resource>';
        return xml;
    };
    ;
    return Resource;
}());
exports.default = Resource;
function isResource(arg) {
    return arg && arg._embedded != undefined && arg._links != undefined && arg._props != undefined;
}
