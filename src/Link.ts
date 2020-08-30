
export type LinkRaw = {
    href: string;
    templated?: boolean;
    type?: string;
    name?: string;
    profile?: string;
    title?: string;
    hreflang?: string;
}

export default class Link {
  public rel: string;
  
  private attributes: {
    href: string;
    templated?: boolean;
    type?: string;
    name?: string;
    profile?: string;
    title?: string;
    hreflang?: string;
  }

  constructor(rel: string, value: string | LinkRaw) {
    if (!rel) throw new Error('Link requires rel');
    this.rel = rel;

    if (typeof value == 'object') {
  
      // If value is a hashmap, just copy properties
      if (!value.href) throw new Error('Required <link> attribute "href"');
      var expectedAttributes = ['href', 'name', 'hreflang', 'title', 'templated', 'icon', 'align', 'method'];
      for (var attr in value) {
        if (value.hasOwnProperty(attr)) {
          if (!~expectedAttributes.indexOf(attr)) {
            // Unexpected attribute: ignore it
            continue;
          }
          this.attributes[attr] = value[attr];
        }
      }
    } else {
  
      // value is a scalar: use its value as href
      if (!value) throw new Error('Required <link> attribute "href"');
      this.attributes.href = String(value);
  
    }
  }

  toRaw = (): LinkRaw => {
    let raw: LinkRaw = Object.keys(this.attributes).reduce((raw, attr) => {
      if (this.attributes[attr]) {
        raw[attr] = this.attributes[attr]
      }
      return raw;
    }, { href: this.attributes.href })
  
    return raw;
  }
}