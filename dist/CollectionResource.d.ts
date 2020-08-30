import Resource from './Resource';
declare type CollectionResourceProps<TItem> = {
    total: number;
    page: number;
    size: number;
    items: Array<TItem>;
};
export default class CollectionResource<TItemProps, TExtraProps = {}> extends Resource<CollectionResourceProps<TItemProps> & TExtraProps> {
    constructor(args: {
        rel: string;
        uri: string;
        props: CollectionResourceProps<TItemProps> & TExtraProps;
        uriTemplateParams?: object;
    });
}
export {};
