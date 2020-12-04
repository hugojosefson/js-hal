
type FIELD_TYPE_TEXT = 'text';
type FIELD_TYPE_NUMBER = 'number';
type FIELD_TYPE_FILE = 'file';
type FIELD_TYPE_EMAIL = 'email';
type FIELD_TYPE_PASSWORD = 'password';
type FIELD_TYPE_CHECKBOX = 'checkbox'; // Implicit dependency to HTML ...?
type FIELD_TYPE_TEXTAREA = 'textarea';
type FIELD_TYPE_SELECT = 'select';
type FIELD_TYPE_ARRAY = 'array';
type FIELD_TYPE_OBJECT = 'object';

type MEDIA_TYPE_IMAGE = "image/jpg" | "image/jpeg" | "image/png" | "image/bmp" | "image/gif" | "image/svg+xml";
type MEDIA_TYPE_OCTET = 'application/octet-stream';
type MEDIA_TYPE_JSON = 'application/json';
type MEDIA_TYPE_HAL = 'application/hal+json';
type MEDIA_TYPE_FORM = 'application/x-www-form-urlencoded';
type MEDIA_TYPE_MULTIPART = 'multipart/form-data';
type MEDIA_TYPES = MEDIA_TYPE_MULTIPART | 
					MEDIA_TYPE_FORM |
					MEDIA_TYPE_JSON | 
					MEDIA_TYPE_HAL | 
                    MEDIA_TYPE_OCTET |
                    MEDIA_TYPE_IMAGE;

type HTTP_GET = 'GET' | 'get';
type HTTP_POST = 'POST' | 'post';
type HTTP_PUT = 'PUT' | 'put';
type HTTP_DELETE = 'DELETE' | 'delete';
type HTTP_PATCH = 'PATCH' | 'patch';
type HTTP_METHODS = HTTP_GET | HTTP_POST | HTTP_PUT | HTTP_DELETE | HTTP_PATCH;

export interface IFieldObject {
	name: string; // REQUIRED. Name of the field. If empty or missing, client SHOULD ignore this field object completely.
	type: FIELD_TYPE_TEXT | 
        FIELD_TYPE_NUMBER |
        FIELD_TYPE_FILE |
        FIELD_TYPE_EMAIL |
        FIELD_TYPE_PASSWORD |
        FIELD_TYPE_CHECKBOX |
        FIELD_TYPE_TEXTAREA |
        FIELD_TYPE_SELECT |
        FIELD_TYPE_ARRAY |
        FIELD_TYPE_OBJECT;// REQUIRED. Type of the field.
	required?: boolean; // Defaults to false.
    default?: string | number | Array<string | number>;
    selected?: number; // index of the default array
    regex?: string; // A regular expression (HTML 5 pattern) to be applied to the value of the field.
    readonly?: boolean; // Indicates whether the field is read-only. Defaults to false.
    schema?: string; // Schema to be used when type is an Array or Object.
    maxLength?: number;
    minLength?: number;
    validationMessage?: string;
    error?: string;
    label?: string;
    hidden?: boolean;
}

export type FormRaw = {
	action: string; // REQURIED. URI pointing to the action
	method: HTTP_METHODS; // REQUIRED.
	type?: MEDIA_TYPES; // Default should be application/json
    fields?: IFieldObject[];
    error?: string;
    text?: string; // User friendly text in case the action only requires a button
}


export default class Form {
    public key: string;
    private action: string; // REQURIED. URI pointing to the action
	private method: HTTP_METHODS; // REQUIRED.
	private type?: MEDIA_TYPES; // Default should be application/json
    private fields?: IFieldObject[];
    private error?: string;
    private text?: string; // User friendly text in case the action only requires a button

    constructor(key: string, value: FormRaw) {
        if(!key) throw new Error('Form requires a key');

        this.key = key;

        if (typeof value != 'object') throw new Error('invalid form value');

        if (!value.action) throw new Error('Form action URI is required'); 

        if (!value.method) throw new Error('Form method is requied');

        // TODO check that action and method exist in value
        var expectedFormAttributes = ['action', 'method', 'type', 'fields', 'error', 'text'];

        // TODO check that field name and type exists
        var expectedFieldAttributes = ['name', 'type', 'required', 'default', 'regex'];

        for (var attr in value) {
            if (!~expectedFormAttributes.indexOf(attr)) {
                continue;
            }

            this[attr] = value[attr];
        }
    }

    toRaw = () => {
        let raw: FormRaw = {
            action: this.action,
            method: this.method,
        }

        if (this.type) {
            raw.type = this.type;
        }

        if (this.fields) {
            raw.fields = this.fields;
        }

        if (this.error) {
            raw.error = this.error;
        }

        if (this.text) {
            raw.text = this.text;
        }
      
        return raw;
    }
}
