import { escapeXml } from './helpers';

export interface ILinkObject {
    href: string;
    templated?: boolean;
    type?: string;
    name?: string;
    profile?: string;
    title?: string;
    hreflang?: string;
}

export interface ILink extends ILinkObject {
    rel: string;
    toJSON: () => any;
    toXML: () => string;
}

  /**
   * Link to another hypermedia
   * @param String rel → the relation identifier
   * @param String|Object value → the href, or the hash of all attributes (including href)
   */
export default function Link (this:ILink, rel: string, value: string | ILinkObject): void {
    if (!(this instanceof Link)) {
      return new Link(rel, value);
    }
  
    if (!rel) throw new Error('Required <link> attribute "rel"');
  
    this.rel = rel;
  
    if (typeof value === 'object') {
  
      // If value is a hashmap, just copy properties
      if (!value.href) throw new Error('Required <link> attribute "href"');
      var expectedAttributes = ['rel', 'href', 'name', 'hreflang', 'title', 'templated', 'icon', 'align', 'method'];
      for (var attr in value) {
        if (value.hasOwnProperty(attr)) {
          if (!~expectedAttributes.indexOf(attr)) {
            // Unexpected attribute: ignore it
            continue;
          }
          this[attr] = value[attr];
        }
      }
  
    } else {
  
      // value is a scalar: use its value as href
      if (!value) throw new Error('Required <link> attribute "href"');
      this.href = String(value);
  
    }
  }
  
  /**
   * XML representation of a link
   */
  Link.prototype.toXML = function () {
    var xml = '<link';
    for (var attr in this) {
      if (this.hasOwnProperty(attr)) {
        xml += ' ' + attr + '="' + escapeXml(this[attr]) + '"';
      }
    }
    xml += ' />';
    return xml;
  }
  
  /**
   * JSON representation of a link
   */
  Link.prototype.toJSON = function () {
    // Note: calling "JSON.stringify(this)" will fail as JSON.stringify itself calls toJSON()
    // We need to copy properties to a new object
    return Object.keys(this).reduce((function (object, key) {
      object[key] = this[key];
      return object;
    }).bind(this), {});
};
  