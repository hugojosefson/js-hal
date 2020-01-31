export interface ILinkObject {
    href: string;
    templated?: boolean;
    type?: string;
    name?: string;
    profile?: string;
    title?: string;
    hreflang?: string;
}
export interface ILink extends ILinkObject {
    rel: string;
    toJSON: () => any;
    toXML: () => string;
}
/**
 * Link to another hypermedia
 * @param String rel → the relation identifier
 * @param String|Object value → the href, or the hash of all attributes (including href)
 */
export default function Link(this: ILink, rel: string, value: string | ILinkObject): void;
