import Resource from './Resource';
import { format as formatUrl, parse as parseUrl } from 'url';


export default class CollectionResource extends Resource {
    constructor(args: {
        embedded: Resource[];
        rel: string;
        url: string;
        props: {
            total: number;
            page: number;
            size: number;
            [key: string]: any;
        }
    }) {
        super(args.props);
        const { props, url } = args;
        const { total, page, size } = props;
        
        this.embed(args.rel, args.embedded);
        let parsed = parseUrl(url, true);
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