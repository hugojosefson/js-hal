import Link, { LinkRaw } from './Link';
import Form, { FormRaw } from './Form';
declare type ResourceRaw<TProps = {}> = TProps & {
    _links?: {
        [key: string]: LinkRaw;
    };
    _embedded?: {
        [key: string]: ResourceRaw;
    };
    _forms?: {
        [key: string]: FormRaw;
    };
};
export default class Resource<TProps extends {
    [key: string]: any;
} = {}> {
    href: string;
    _props: TProps;
    _links: {
        [key: string]: Link | Array<Link>;
    };
    _embedded: {
        [key: string]: Resource<any> | Array<Resource<any>>;
    };
    _forms: {
        [key: string]: Form | Array<Form>;
    };
    /**
     * A hypertext resource
     * @param Object object → the base properties
     *                      Define "href" if you choose not to pass parameter "uri"
     *                      Do not define "_links" and "_embedded" unless you know what you're doing
     * @param String uri → href for the <link rel="self"> (can use reserved "href" property instead)
     */
    constructor(props: TProps, uri?: string, uriTemplateParams?: object);
    addLink(rel: string, value: string | LinkRaw, uriTemplateParams?: object): void;
    addForm(key: string, value: FormRaw): void;
    /**
     * Add an embedded resource
     * @param String rel → the relation identifier (should be plural)
     * @param Resource|Resource[] → resource(s) to embed
     */
    addEmbedded(rel: any, resource: any): void;
    /**
     * Returns raw representation of the resource
     */
    toRaw: () => ResourceRaw<TProps>;
    static isResource(arg: any): arg is Resource;
}
export {};
