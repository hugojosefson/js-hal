import { describe, it } from 'mocha';
import { assert } from 'chai';
import { Resource } from '../src/hal';

describe("Resource", () => {

    it('Should embed resource and array of resources', () => {
        let expected = {
            _links: {
                self: { href: 'http://example.com' },
                Derp: {
                    href: 'http://example.com/Derp', title: 'derpderp'
                }
            },
            count: 0,
            name: 'parent',
            _embedded: {
                EmbeddedObj: {
                    _links: {
                        self: { href: 'http://example.com/EmbeddedObj' }
                    },
                    asdf: 'wefwefwef',
                    rgerg: {
                        wefwef: 'wefwef'
                    }
                },
                ArrayofResources: [
                    {
                        _links: {
                            self: { href: 'http://example.com/EmbeddedObj2' }
                        },
                        asdf: 'wefwefwef',
                        rgerg: {
                            wefwef: 'wefwef'
                        }
                    },
                    {
                        _links: {
                            self: { href: 'http://example.com/EmbeddedObj3' }
                        },
                        asdf: 'wefwefwef',
                        rgerg: {
                            wefwef: 'wefwef'
                        }
                    },
                ]
            }
        }

        let resource = new Resource({
            count: 0,
            name: 'parent'
        }, 'http://example.com')

        resource.link('Derp', { href: 'http://example.com/Derp', title: 'derpderp' })
        
        let embeddedObj = new Resource({
            asdf: 'wefwefwef',
            rgerg: {
                wefwef: 'wefwef'
            }
        }, 'http://example.com/EmbeddedObj')

        resource.embed('EmbeddedObj', embeddedObj);

        let embeddedArr = [
            new Resource({
                asdf: 'wefwefwef',
                rgerg: {
                    wefwef: 'wefwef'
                }
            }, 'http://example.com/EmbeddedObj2'),
            new Resource({
                asdf: 'wefwefwef',
                rgerg: {
                    wefwef: 'wefwef'
                }
            }, 'http://example.com/EmbeddedObj3')
        ]

        resource.embed('ArrayofResources', embeddedArr)

        assert.deepEqual(resource.toJSON(), expected);
    })

    it('Should expand uri template', () => {
        let expected = {
            _links: {
                self: { href: "/orders/12345" }
            }
        };

        let resource = new Resource({}, '/orders/{id}', {id: 12345});

        assert.deepEqual(expected, resource.toJSON());
    })


    it('Should exand uri template for when calling link() with url string', () => {
        let expected = {
            _links: {
                derp: { href: "/orders/12345" }
            }
        };

        let resource = new Resource({});
        resource.link('derp', '/orders/{id}', {id: 12345})
        
        assert.deepEqual(expected, resource.toJSON());
    })

    it('Should exand uri template for when calling link() with link object', () => {
        let expected = {
            _links: {
                derp: { href: "/orders/12345" }
            }
        };

        let resource = new Resource({});
        resource.link('derp', {
            href: '/orders/{id}'
        }, {id: 12345})
        
        assert.deepEqual(expected, resource.toJSON());
    })
})