declare type FIELD_TYPE_TEXT = 'text';
declare type FIELD_TYPE_NUMBER = 'number';
declare type FIELD_TYPE_HIDDEN = 'hidden';
declare type FIELD_TYPE_FILE = 'file';
declare type FIELD_TYPES = FIELD_TYPE_TEXT | FIELD_TYPE_NUMBER | FIELD_TYPE_HIDDEN | FIELD_TYPE_FILE;
declare type MEDIA_TYPE_OCTET = 'application/octet-stream';
declare type MEDIA_TYPE_JSON = 'application/json';
declare type MEDIA_TYPE_HAL = 'application/hal+json';
declare type MEDIA_TYPE_FORM = 'application/x-www-form-urlencoded';
declare type MEDIA_TYPE_MULTIPART = 'multipart/form-data';
declare type MEDIA_TYPES = MEDIA_TYPE_MULTIPART | MEDIA_TYPE_FORM | MEDIA_TYPE_JSON | MEDIA_TYPE_HAL | MEDIA_TYPE_OCTET;
declare type HTTP_GET = 'GET';
declare type HTTP_POST = 'POST';
declare type HTTP_PUT = 'PUT';
declare type HTTP_DELETE = 'DELETE';
declare type HTTP_PATCH = 'PATCH';
declare type HTTP_METHODS = HTTP_GET | HTTP_POST | HTTP_PUT | HTTP_DELETE | HTTP_PATCH;
interface IFieldObject {
    name: string;
    type: FIELD_TYPES;
    required?: boolean;
    default?: string | number;
    regex?: RegExp;
    readonly?: boolean;
}
interface IFormObject {
    action: string;
    method: HTTP_METHODS;
    type?: MEDIA_TYPES | string;
    fields?: IFieldObject[];
}
interface IForm extends IFormObject {
    key: string;
    toJSON: () => any;
}
interface ILinkObject {
    href: string;
    templated?: boolean;
    type?: string;
    name?: string;
    profile?: string;
    title?: string;
    hreflang?: string;
}
interface ILink extends ILinkObject {
    rel: string;
    toJSON: () => any;
    toXML: () => string;
}
/**
 * Link to another hypermedia
 * @param String rel → the relation identifier
 * @param String|Object value → the href, or the hash of all attributes (including href)
 */
declare function Link(this: ILink, rel: string, value: string | ILinkObject): void;
interface IResource<T> {
    _links: {
        self?: ILink;
        [key: string]: ILink | ILink[];
    };
    _embedded: {
        [key: string]: Resource<T> | Resource<T>[];
    };
    _forms: {
        [key: string]: IForm | IForm[];
    };
    href: string;
    props: T;
    link: (rel: string, uri: string) => Resource<T>;
    embed: (rel: string, resource: any, pluralize?: boolean) => Resource<T>;
    form: (key: string, value: IFormObject) => Resource<T>;
    [key: string]: any;
}
declare class Resource<T = any> implements IResource<T> {
    href: string;
    props: T;
    _links: {
        self?: ILink;
        [key: string]: ILink | ILink[];
    };
    _embedded: {
        [key: string]: Resource<T> | Resource<T>[];
    };
    _forms: {
        [key: string]: IForm | IForm[];
    };
    /**
     * A hypertext resource
     * @param Object object → the base properties
     *                      Define "href" if you choose not to pass parameter "uri"
     *                      Do not define "_links" and "_embedded" unless you know what you're doing
     * @param String uri → href for the <link rel="self"> (can use reserved "href" property instead)
     */
    constructor(object: T, uri?: string);
    link(rel: string, uri: string): Resource<T>;
    form(key: string, value: IFormObject): Resource<T>;
    /**
     * Add an embedded resource
     * @param String rel → the relation identifier (should be plural)
     * @param Resource|Resource[] → resource(s) to embed
     */
    embed(rel: any, resource: any, pluralize?: boolean): Resource<T>;
    /**
     * JSON representation of the resource
     * Requires "JSON.stringify()"
     * @param String indent → how you want your JSON to be indented
     */
    toJSON(indent?: any): any;
    /**
     * XML representation of the resource
     * @param String indent → how you want your XML to be indented
     */
    toXML(indent?: any): string;
    /**
     * Returns the JSON representation indented using tabs
     */
    toString(): any;
}
/**
 * Public API
 */
export { Resource, Link };
