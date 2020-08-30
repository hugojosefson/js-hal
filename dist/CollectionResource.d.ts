import Resource from './Resource';
declare type CollectionResourceProps<TItemProps> = {
    total: number;
    page: number;
    size: number;
    items: Array<Resource<TItemProps>>;
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
