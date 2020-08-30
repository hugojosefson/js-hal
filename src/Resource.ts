import * as urlTemplate from 'url-template';
import Link, { LinkRaw } from './Link';
import Form, { FormRaw } from './Form';

export type ResourceRaw<TProps = {}> = TProps & {
    _links?: { [key: string]: LinkRaw };
    _embedded?: { [key: string]: ResourceRaw }
    _forms?: { [key: string]: FormRaw }
}

export default class Resource<TProps extends { [key: string] : any } = {}> {
    private href: string;
    private _props: TProps;
    private _links: { [key: string]: Link | Array<Link>; } = {}
    private _embedded: { [key: string]: Resource<any> | Array<Resource<any>>; } = {}
    private _forms: { [key: string]: Form | Array<Form>; } = {}

    /**
     * A hypertext resource
     * @param Object object → the base properties
     *                      Define "href" if you choose not to pass parameter "uri"
     *                      Do not define "_links" and "_embedded" unless you know what you're doing
     * @param String uri → href for the <link rel="self"> (can use reserved "href" property instead)
     */
    constructor(props: TProps, uri?: string, uriTemplateParams?: object) {
        this._links = {};
        this._embedded = {};
        this._forms = {};

        if (typeof props != "object") {
            throw new Error('Invalid props');
        }

        if (props._links) {
            this._links = props._links;
            delete props._links;
        }

        if (props._embedded) {
            this._embedded = props._embedded;
            delete props._embedded;
        }

        this._props = props;

        if (uri) {
            uri = urlTemplate.parse(uri).expand(uriTemplateParams || {});
        }
        
        // If we have a URI, add this link
        // If not, we won't have a valid object (this may lead to a fatal error later)
        if (uri) this.addLink('self', uri);
    }

    addLink(rel: string, value: string | LinkRaw, uriTemplateParams?: object) {
        if (typeof value == 'string') {
            value = uriTemplateParams ? 
                urlTemplate.parse(value).expand(uriTemplateParams)
                : value;
        } else {
            value.href = uriTemplateParams ?
                urlTemplate.parse(value.href).expand(uriTemplateParams)
                : value.href;
        }
        
        let link = new Link(rel, value);

        let _links = this._links[link.rel]
        
        if (!_links) {
            this._links[link.rel] = link;
        } else if (Array.isArray(_links)) {
            _links.push(link)
        } else {
            this._links[link.rel] = [_links, link]
        }
    };

    addForm(key: string, value: FormRaw) {
        let form = new Form(key, value);
        
        let _forms = this._forms[form.key]

        if (!_forms) {
            this._forms[form.key] = form;
        } else if (Array.isArray(_forms)) {
            _forms.push(form)
        } else {
            this._forms[form.key] = [_forms, form]
        }
    }

    /**
     * Add an embedded resource
     * @param String rel → the relation identifier (should be plural)
     * @param Resource|Resource[] → resource(s) to embed
     */
    addEmbedded(rel, resource) {
        let _embedded = this._embedded[rel]
    
        // Append resource(s)
        if (Array.isArray(resource)) {
            
            resource = resource.map((object) => {
                return Resource.isResource(object) ? object : new Resource(object);
            })

            if (_embedded && Array.isArray(_embedded)) {
                _embedded = _embedded.concat(resource);
            } else if (!_embedded) {
                _embedded = resource;
            }

        } else {
          _embedded = Resource.isResource(resource) ? resource : new Resource(resource);
        }

        this._embedded[rel] = _embedded;
    };

    /**
     * Returns raw representation of the resource
     */
    toRaw = (): ResourceRaw<TProps> => {
        var result: ResourceRaw<TProps> = {} as ResourceRaw<TProps>;

        for (var prop in this._props) {
            if (this._props.hasOwnProperty(prop)) {
                let property = this._props[prop];

                result[prop] = Resource.isResource(property) ? property.toRaw() : property
            }
        }

        if (Object.keys(this._links).length > 0) {
            // Note: we need to copy data to remove "rel" property without corrupting original Link object
            result._links = Object.keys(this._links)
                .reduce((links, rel) => {
                    let _links = this._links[rel];
                    let isArray = (arg): arg is Array<Link> => Array.isArray(arg);
                    
                    if (isArray(_links)) {
                        links[rel] = new Array()
                        for (var i=0; i < _links.length; i++)
                            links[rel].push(_links[i].toRaw())

                    } else {
                        var link = _links.toRaw();
                        links[rel] = link;
                    }
                    return links;
                }, {});
        }

        if (Object.keys(this._embedded).length > 0) {
            result._embedded = {};
            for (var rel in this._embedded) {
                let embedded = this._embedded[rel]
                
                result._embedded[rel] = Array.isArray(embedded) ? 
                    embedded.map(embedded => embedded.toRaw()): 
                    embedded.toRaw()
            }
        }

        if (Object.keys(this._forms).length > 0) {
            result._forms = Object.keys(this._forms)
                .reduce((forms, rel) => {

                    let _forms = this._forms[rel];
                    let isArray = (arg): arg is Array<Form> => Array.isArray(arg);
                    
                    if (isArray(_forms)) {
                        
                        forms[rel] = new Array()
                        for (var i=0; i < _forms.length; i++)
                        forms[rel].push(_forms[i].toRaw())
            
                    } else {
                        var form = _forms.toRaw();
                        forms[rel] = form;
                    }
                    return forms;
            
                }, {});
        }

        
        return result;
    };

    static isResource(arg): arg is Resource {
        return arg && arg._embedded != undefined && arg._links != undefined && arg._props != undefined;
    }
}