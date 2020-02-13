import * as urlTemplate from 'url-template';
import Resource from './Resource';
import { format as formatUrl, parse as parseUrl } from 'url';

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
        },
        uriTemplateParams?: object
    }) {
        super(args.props);
        let { props, uri, uriTemplateParams } = args;
        let { total, page, size } = props;
        
        if (uriTemplateParams) {
            uri = urlTemplate.parse(uri).expand(uriTemplateParams)
        }

        this.embed(args.rel, args.embedded);
        let parsed = parseUrl(uri, true);
        let pathname = parsed.pathname;
        
        parsed.query['page'] = '' + page;
        parsed.query['size'] = '' + size;
        this.link('self', formatUrl({ pathname, query: parsed.query }));

        if (total > size * (page + 1)) {
            parsed.query['page'] = '' + (page + 1);
            this.link('next', formatUrl({ pathname, query: parsed.query }))
        }

        if (total > 0 && page > 0) {
            parsed.query['page'] = '' + (page - 1);
            this.link('prev', formatUrl({ pathname, query: parsed.query }))
        }
    }
}