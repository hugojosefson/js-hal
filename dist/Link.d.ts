export declare type LinkRaw = {
    href: string;
    templated?: boolean;
    type?: string;
    name?: string;
    profile?: string;
    title?: string;
    hreflang?: string;
};
export default class Link {
    rel: string;
    private attributes;
    constructor(rel: string, value: string | LinkRaw);
    toRaw: () => LinkRaw;
}
