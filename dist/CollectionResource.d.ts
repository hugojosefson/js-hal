import Resource from './Resource';
declare type CollectionResourceProps = {
    total: number;
    page: number;
    size: number;
};
export default class CollectionResource<TExtraProps = {}> extends Resource<CollectionResourceProps & TExtraProps> {
    constructor(args: {
        embedded: Array<Resource>;
        rel: string;
        uri: string;
        props: CollectionResourceProps & TExtraProps;
        uriTemplateParams?: object;
    });
}
export {};
