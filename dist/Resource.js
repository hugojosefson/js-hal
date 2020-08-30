"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var urlTemplate = require("url-template");
var Link_1 = require("./Link");
var Form_1 = require("./Form");
var Resource = /** @class */ (function () {
    /**
     * A hypertext resource
     * @param Object object → the base properties
     *                      Define "href" if you choose not to pass parameter "uri"
     *                      Do not define "_links" and "_embedded" unless you know what you're doing
     * @param String uri → href for the <link rel="self"> (can use reserved "href" property instead)
     */
    function Resource(props, uri, uriTemplateParams) {
        var _this = this;
        this._links = {};
        this._embedded = {};
        this._forms = {};
        /**
         * Returns raw representation of the resource
         */
        this.toRaw = function () {
            var result = {};
            for (var prop in _this._props) {
                if (_this._props.hasOwnProperty(prop)) {
                    var property = _this._props[prop];
                    result[prop] = Resource.isResource(property) ? property.toRaw() : property;
                }
            }
            if (Object.keys(_this._links).length > 0) {
                // Note: we need to copy data to remove "rel" property without corrupting original Link object
                result._links = Object.keys(_this._links)
                    .reduce(function (links, rel) {
                    var _links = _this._links[rel];
                    var isArray = function (arg) { return Array.isArray(arg); };
                    if (isArray(_links)) {
                        links[rel] = new Array();
                        for (var i = 0; i < _links.length; i++)
                            links[rel].push(_links[i].toRaw());
                    }
                    else {
                        var link = _links.toRaw();
                        links[rel] = link;
                    }
                    return links;
                }, {});
            }
            if (Object.keys(_this._embedded).length > 0) {
                result._embedded = {};
                for (var rel in _this._embedded) {
                    var embedded = _this._embedded[rel];
                    result._embedded[rel] = Array.isArray(embedded) ?
                        embedded.map(function (embedded) { return embedded.toRaw(); }) :
                        embedded.toRaw();
                }
            }
            if (Object.keys(_this._forms).length > 0) {
                result._forms = Object.keys(_this._forms)
                    .reduce(function (forms, rel) {
                    var _forms = _this._forms[rel];
                    var isArray = function (arg) { return Array.isArray(arg); };
                    if (isArray(_forms)) {
                        forms[rel] = new Array();
                        for (var i = 0; i < _forms.length; i++)
                            forms[rel].push(_forms[i].toRaw());
                    }
                    else {
                        var form = _forms.toRaw();
                        forms[rel] = form;
                    }
                    return forms;
                }, {});
            }
            return result;
        };
        this._links = {};
        this._embedded = {};
        this._forms = {};
        if (typeof props != "object") {
            throw new Error('Invalid props');
        }
        if (props._links) {
            this._links = props._links;
            delete props._links;
        }
        if (props._embedded) {
            this._embedded = props._embedded;
            delete props._embedded;
        }
        this._props = props;
        if (uri) {
            uri = urlTemplate.parse(uri).expand(uriTemplateParams || {});
        }
        // If we have a URI, add this link
        // If not, we won't have a valid object (this may lead to a fatal error later)
        if (uri)
            this.addLink('self', uri);
    }
    Resource.prototype.addLink = function (rel, value, uriTemplateParams) {
        if (typeof value == 'string') {
            value = uriTemplateParams ?
                urlTemplate.parse(value).expand(uriTemplateParams)
                : value;
        }
        else {
            value.href = uriTemplateParams ?
                urlTemplate.parse(value.href).expand(uriTemplateParams)
                : value.href;
        }
        var link = new Link_1.default(rel, value);
        var _links = this._links[link.rel];
        if (!_links) {
            this._links[link.rel] = link;
        }
        else if (Array.isArray(_links)) {
            _links.push(link);
        }
        else {
            this._links[link.rel] = [_links, link];
        }
    };
    ;
    Resource.prototype.addForm = function (key, value) {
        var form = new Form_1.default(key, value);
        var _forms = this._forms[form.key];
        if (!_forms) {
            this._forms[form.key] = form;
        }
        else if (Array.isArray(_forms)) {
            _forms.push(form);
        }
        else {
            this._forms[form.key] = [_forms, form];
        }
    };
    /**
     * Add an embedded resource
     * @param String rel → the relation identifier (should be plural)
     * @param Resource|Resource[] → resource(s) to embed
     */
    Resource.prototype.addEmbedded = function (rel, resource) {
        var _embedded = this._embedded[rel];
        // Append resource(s)
        if (Array.isArray(resource)) {
            resource = resource.map(function (object) {
                return Resource.isResource(object) ? object : new Resource(object);
            });
            if (_embedded && Array.isArray(_embedded)) {
                _embedded = _embedded.concat(resource);
            }
            else if (!_embedded) {
                _embedded = resource;
            }
        }
        else {
            _embedded = Resource.isResource(resource) ? resource : new Resource(resource);
        }
        this._embedded[rel] = _embedded;
    };
    ;
    Resource.isResource = function (arg) {
        return arg && arg._embedded != undefined && arg._links != undefined && arg._props != undefined;
    };
    return Resource;
}());
exports.default = Resource;
