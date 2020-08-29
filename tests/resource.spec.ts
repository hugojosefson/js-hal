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

        resource.addLink('Derp', { href: 'http://example.com/Derp', title: 'derpderp' })
        
        let embeddedObj = new Resource({
            asdf: 'wefwefwef',
            rgerg: {
                wefwef: 'wefwef'
            }
        }, 'http://example.com/EmbeddedObj')

        resource.addEmbedded('EmbeddedObj', embeddedObj);

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

        resource.addEmbedded('ArrayofResources', embeddedArr)

        assert.deepEqual(resource.toRaw(), expected);
    })

    it('Should expand uri template', () => {
        let expected = {
            _links: {
                self: { href: "/orders/12345" }
            }
        };

        let resource = new Resource({}, '/orders/{id}', {id: 12345});

        assert.deepEqual(expected, resource.toRaw());
    })


    it('Should exand uri template for when calling link() with url string', () => {
        let expected = {
            _links: {
                derp: { href: "/orders/12345" }
            }
        };

        let resource = new Resource({});
        resource.addLink('derp', '/orders/{id}', {id: 12345})
        
        assert.deepEqual(expected, resource.toRaw());
    })

    it('Should exand uri template for when calling link() with link object', () => {
        let expected = {
            _links: {
                derp: { href: "/orders/12345" }
            }
        };

        let resource = new Resource({});
        resource.addLink('derp', {
            href: '/orders/{id}'
        }, {id: 12345})
        
        assert.deepEqual(expected, resource.toRaw());
    })

    it('Should not expand uri template if params are not provided', () => {
        let expected = {
            _links: {
                derp: { href: "/orders/{id}" }
            }
        };

        let resource = new Resource({});
        resource.addLink('derp', {
            href: '/orders/{id}'
        })
        
        assert.deepEqual(expected, resource.toRaw());
    })
})