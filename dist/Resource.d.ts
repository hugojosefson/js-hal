import { LinkRaw } from './Link';
import { FormRaw } from './Form';
export declare type ResourceRaw<TProps = {
    [key: string]: any;
}, TEmbedded = {
    [key: string]: ResourceRaw;
}> = TProps & {
    _links?: {
        [key: string]: LinkRaw;
    };
    _embedded?: TEmbedded;
    _forms?: {
        [key: string]: FormRaw;
    };
};
export default class Resource<TProps extends {
    [key: string]: any;
} = {}> {
    private href;
    private _props;
    private _links;
    private _embedded;
    private _forms;
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
