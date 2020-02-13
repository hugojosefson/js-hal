import Resource from './Resource';
export default class CollectionResource extends Resource {
    constructor(args: {
        embedded: Resource[];
        rel: string;
        uri: string;
        props: {
            total: number;
            page: number;
            size: number;
            [key: string]: any;
        };
        uriTemplateParams?: object;
    });
}
