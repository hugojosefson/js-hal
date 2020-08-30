import * as urlTemplate from 'url-template';
import Resource, { ResourceRaw } from './Resource';
import { format as formatUrl, parse as parseUrl } from 'url';

export type CollectionResourceProps<TItem> = {
    total: number;
    page: number;
    size: number;
    items: Array<TItem>
}

export default class CollectionResource<TItemProps, TExtraProps = {}> extends Resource<CollectionResourceProps<TItemProps> & TExtraProps> {
    constructor(args: {
        uri: string;
        props: CollectionResourceProps<TItemProps> & TExtraProps,
        uriTemplateParams?: object
    }) {
        super(args.props);
        let { props, uri, uriTemplateParams } = args;
        let { total, page, size } = props;

        uriTemplateParams = uriTemplateParams || {};
        uriTemplateParams['page'] = page;
        uriTemplateParams['size'] = size;
        uri = urlTemplate.parse(uri).expand(uriTemplateParams)

        let parsed = parseUrl(uri, true);
        let pathname = parsed.pathname;
        
        parsed.query['page'] = '' + page;
        parsed.query['size'] = '' + size;
        this.addLink('self', formatUrl({ pathname, query: parsed.query }));

        if (total > size * (page + 1)) {
            parsed.query['page'] = '' + (page + 1);
            this.addLink('next', formatUrl({ pathname, query: parsed.query }))
        }

        if (total > 0 && page > 0) {
            parsed.query['page'] = '' + (page - 1);
            this.addLink('prev', formatUrl({ pathname, query: parsed.query }))
        }
    }
}