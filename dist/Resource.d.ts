import { ILink, ILinkObject } from './Link';
import { IForm, IFormObject } from './Form';
export default class Resource {
    href: string;
    _props: any;
    _links: {
        self?: ILink;
        [key: string]: ILink | ILink[];
    };
    _embedded: {
        [key: string]: Resource | Resource[];
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
    constructor(object: any, uri?: string, uriTemplateParams?: object);
    link(rel: string, value: string | ILinkObject, uriTemplateParams?: object): Resource;
    form(key: string, value: IFormObject): Resource;
    /**
     * Add an embedded resource
     * @param String rel → the relation identifier (should be plural)
     * @param Resource|Resource[] → resource(s) to embed
     */
    embed(rel: any, resource: any): Resource;
    /**
     * JSON representation of the resource
     * Requires "JSON.stringify()"
     * @param String indent → how you want your JSON to be indented
     */
    toJSON(): any;
    /**
     * XML representation of the resource
     * @param String indent → how you want your XML to be indented
     */
    toXML(rel: string, indent?: string): string;
}
