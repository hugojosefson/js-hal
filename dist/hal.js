"use strict";
/*

{
    "_links": {
        "self": {
            "href": "/videos/12345"
        }
    },

    "_forms": {
        "Upload": {
            "action": "/videos/12345/upload",
            "method": "POST",
            "type": "multipart/form-data",
            "fields": [
                {
                    "name": "data",
                    "type": "file"
                },
                {
                    "name": "id",
                    "type": "text"
                }
            ]
        }
    },

    "id": "12345",
    "privacy": "PUBLIC",
    "creatorId": "5g9ace1",
    "title": "Meme Vids",
    "description": "This vid is meme as hec",
    "thumbnailURL": "https://cdn.octastream.com/images/g231sa52d",
    "status": "NOT_AVAILABLE"
}

*/
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
Form.prototype.toJSON = function () {
    // Note: calling "JSON.stringify(this)" will fail as JSON.stringify itself calls toJSON()
    // We need to copy properties to a new object
    return Object.keys(this).reduce((function (object, key) {
        object[key] = this[key];
        return object;
    }).bind(this), {});
};
/**
 * Link to another hypermedia
 * @param String rel → the relation identifier
 * @param String|Object value → the href, or the hash of all attributes (including href)
 */
function Link(rel, value) {
    if (!(this instanceof Link)) {
        return new Link(rel, value);
    }
    if (!rel)
        throw new Error('Required <link> attribute "rel"');
    this.rel = rel;
    if (typeof value === 'object') {
        // If value is a hashmap, just copy properties
        if (!value.href)
            throw new Error('Required <link> attribute "href"');
        var expectedAttributes = ['rel', 'href', 'name', 'hreflang', 'title', 'templated', 'icon', 'align', 'method'];
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
exports.Link = Link;
/**
 * XML representation of a link
 */
Link.prototype.toXML = function () {
    var xml = '<link';
    for (var attr in this) {
        if (this.hasOwnProperty(attr)) {
            xml += ' ' + attr + '="' + escapeXml(this[attr]) + '"';
        }
    }
    xml += ' />';
    return xml;
};
/**
 * JSON representation of a link
 */
Link.prototype.toJSON = function () {
    // Note: calling "JSON.stringify(this)" will fail as JSON.stringify itself calls toJSON()
    // We need to copy properties to a new object
    return Object.keys(this).reduce((function (object, key) {
        object[key] = this[key];
        return object;
    }).bind(this), {});
};
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
        // Copy properties from object
        // we copy AFTER initializing _links and _embedded so that user
        // **CAN** (but should not) overwrite them
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                this[property] = object[property];
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
            this.link(new Link('self', uri));
    }
    Resource.prototype.link = function (link) {
        if (arguments.length > 1) {
            link = new Link(arguments[0], arguments[1]);
        }
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
        var form = new Form(key, value);
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
    Resource.prototype.embed = function (rel, resource, pluralize) {
        if (typeof pluralize === 'undefined')
            pluralize = true;
        // [Naive pluralize](https://github.com/naholyr/js-hal#why-this-crappy-singularplural-management%E2%80%AF)
        if (pluralize && rel.substring(rel.length - 1) !== 's') {
            rel += 's';
        }
        var _embedded = this._embedded[rel];
        // Initialize embedded container
        if (this._embedded[rel] && !Array.isArray(_embedded)) {
            this._embedded[rel] = [_embedded];
        }
        else if (!this._embedded[rel]) {
            this._embedded[rel] = [];
        }
        // Append resource(s)
        if (Array.isArray(resource)) {
            this._embedded[rel] = this._embedded[rel].concat(resource.map(function (object) {
                return new Resource(object);
            }));
        }
        else {
            this._embedded[rel] = new Resource(resource);
        }
        return this;
    };
    ;
    /**
     * JSON representation of the resource
     * Requires "JSON.stringify()"
     * @param String indent → how you want your JSON to be indented
     */
    Resource.prototype.toJSON = function (indent) {
        return resourceToJsonObject(this);
    };
    ;
    /**
     * XML representation of the resource
     * @param String indent → how you want your XML to be indented
     */
    Resource.prototype.toXML = function (indent) {
        return resourceToXml(this, null, '', indent || '');
    };
    ;
    /**
     * Returns the JSON representation indented using tabs
     */
    Resource.prototype.toString = function () {
        return this.toJSON('\t');
    };
    ;
    return Resource;
}());
exports.Resource = Resource;
/**
 * Convert a resource to a stringifiable anonymous object
 * @private
 * @param Resource resource
 */
function resourceToJsonObject(resource) {
    var result = {};
    for (var prop in resource) {
        if (prop === '_links') {
            if (Object.keys(resource._links).length > 0) {
                // Note: we need to copy data to remove "rel" property without corrupting original Link object
                result._links = Object.keys(resource._links).reduce(function (links, rel) {
                    var _links = resource._links[rel];
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
        }
        else if (prop === '_embedded') {
            if (Object.keys(resource._embedded).length > 0) {
                // Note that we do not reformat _embedded
                // which means we voluntarily DO NOT RESPECT the following constraint:
                // > Relations with one corresponding Resource/Link have a single object
                // > value, relations with multiple corresponding HAL elements have an
                // > array of objects as their value.
                // Come on, resource one is *really* dumb.
                result._embedded = {};
                for (var rel in resource._embedded) {
                    result._embedded[rel] = resource._embedded[rel].map(resourceToJsonObject);
                }
            }
        }
        else if (prop === '_forms') {
            result._forms = Object.keys(resource._forms).reduce(function (forms, rel) {
                var _forms = resource._forms[rel];
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
        else if (resource.hasOwnProperty(prop)) {
            result[prop] = resource[prop];
        }
    }
    return result;
}
/**
 * Escape an XML string: encodes double quotes and tag enclosures
 * @private
 */
function escapeXml(string) {
    return String(string).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
;
/**
 * Convert a resource to its XML representation
 * @private
 * @param Resource resource
 * @param String rel → relation identifier for embedded object
 * @param String currentIdent → current indentation
 * @param String nextIndent → next indentation
 */
function resourceToXml(resource, rel, currentIndent, nextIndent) {
    // Do not add line feeds if no indentation is asked
    var LF = (currentIndent || nextIndent) ? '\n' : '';
    // Resource tag
    var xml = currentIndent + '<resource';
    // Resource attributes: rel, href, name
    if (rel)
        xml += ' rel="' + escapeXml(rel) + '"';
    if (resource.href || resource._links.self)
        xml += ' href="' + escapeXml(resource.href || resource._links.self.href) + '"';
    if (resource.name)
        xml += ' name="' + escapeXml(resource.name) + '"';
    xml += '>' + LF;
    // Add <link> tags
    for (var rel in resource._links) {
        if (!resource.href && rel === 'self')
            continue;
        xml += currentIndent + nextIndent + resource._links[rel].toXML() + LF;
    }
    // Add embedded
    for (var embed in resource._embedded) {
        // [Naive singularize](https://github.com/naholyr/js-hal#why-this-crappy-singularplural-management%E2%80%AF)
        var rel = embed.replace(/s$/, '');
        resource._embedded[embed].forEach(function (res) {
            xml += resourceToXml(res, rel, currentIndent + nextIndent, currentIndent + nextIndent + nextIndent) + LF;
        });
    }
    // Add properties as tags
    for (var prop in resource) {
        if (resource.hasOwnProperty(prop) && prop !== '_links' && prop !== '_embedded') {
            xml += currentIndent + nextIndent + '<' + prop + '>' + String(resource[prop]) + '</' + prop + '>' + LF;
        }
    }
    // Close tag and return the shit
    xml += currentIndent + '</resource>';
    return xml;
}
