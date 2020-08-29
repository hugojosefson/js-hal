
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
  private href: string;
  private templated?: boolean;
  private type?: string;
  private name?: string;
  private profile?: string;
  private title?: string;
  private hreflang?: string;

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
          this[attr] = value[attr];
        }
      }
    } else {
  
      // value is a scalar: use its value as href
      if (!value) throw new Error('Required <link> attribute "href"');
      this.href = String(value);
  
    }
  }

  toRaw = (): LinkRaw => {
    let raw: LinkRaw = {
      href: this.href,
      templated: this.templated,
      type: this.type,
      name: this.name,
      profile: this.profile,
      title: this.title,
      hreflang: this.hreflang,
    }

    return raw;
  }
}