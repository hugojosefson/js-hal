type FIELD_TYPE_TEXT = 'text';
type FIELD_TYPE_NUMBER = 'number';
type FIELD_TYPE_HIDDEN = 'hidden';
type FIELD_TYPE_FILE = 'file';
type FIELD_TYPE_EMAIL = 'email';
type FIELD_TYPE_PASSWORD = 'password';
type FIELD_TYPE_CHECKBOX = 'checkbox'; // Implicit dependency to HTML ...?


type MEDIA_TYPE_OCTET = 'application/octet-stream';
type MEDIA_TYPE_JSON = 'application/json';
type MEDIA_TYPE_HAL = 'application/hal+json';
type MEDIA_TYPE_FORM = 'application/x-www-form-urlencoded';
type MEDIA_TYPE_MULTIPART = 'multipart/form-data';
type MEDIA_TYPES = MEDIA_TYPE_MULTIPART | 
					MEDIA_TYPE_FORM |
					MEDIA_TYPE_JSON | 
					MEDIA_TYPE_HAL | 
					MEDIA_TYPE_OCTET;

type HTTP_GET = 'GET' | 'get';
type HTTP_POST = 'POST' | 'post';
type HTTP_PUT = 'PUT' | 'put';
type HTTP_DELETE = 'DELETE' | 'delete';
type HTTP_PATCH = 'PATCH' | 'patch';
type HTTP_METHODS = HTTP_GET | HTTP_POST | HTTP_PUT | HTTP_DELETE | HTTP_PATCH;

interface IFieldObject {
	name: string; // REQUIRED. Name of the field. If empty or missing, client SHOULD ignore this field object completely.
	type: FIELD_TYPE_TEXT | 
        FIELD_TYPE_NUMBER |
        FIELD_TYPE_HIDDEN |
        FIELD_TYPE_FILE |
        FIELD_TYPE_EMAIL |
        FIELD_TYPE_PASSWORD |
        FIELD_TYPE_CHECKBOX; // REQUIRED. Type of the field.
	required?: boolean; // Defaults to false.
	default?: string | number;
    regex?: RegExp; // A regular expression (HTML 5 pattern) to be applied to the value of the field.
    readonly?: boolean; // Indicates whether the field is read-only. Defaults to false.
    maxLength?: number;
    minLength?: number;
}

export interface IFormObject {
	action: string; // REQURIED. URI pointing to the action
	method: HTTP_METHODS; // REQUIRED.
	type?: MEDIA_TYPES | string; // Default should be application/json
	fields?: IFieldObject[];
}

export interface IForm extends IFormObject {
    key: string;
    toJSON: () => any;
}

export default function Form(this:IForm, key: string, value: IFormObject): void {
	if (!(this instanceof Form)) return new Form(key, value);

	if(!key) throw new Error('Form requires a key');

	this.key = key;

	if (typeof value != 'object') throw new Error('invalid form value');

    if (!value.action) throw new Error('Form action URI is required'); 

    if (!value.method) throw new Error('Form method is requied');

	// TODO check that action and method exist in value
	var expectedFormAttributes = ['action', 'method', 'type', 'fields'];

	// TODO check that field name and type exists
	var expectedFieldAttributes = ['name', 'type', 'required', 'default', 'regex'];

	
	for (var attr in value) {
		if (!~expectedFormAttributes.indexOf(attr)) {
			continue;
		}

		this[attr] = value[attr];
	}
}

Form.prototype.toJSON = function() {
  // Note: calling "JSON.stringify(this)" will fail as JSON.stringify itself calls toJSON()
  // We need to copy properties to a new object
  return Object.keys(this).reduce((function (object, key) {
    object[key] = this[key];
    return object;
  }).bind(this), {});
}

