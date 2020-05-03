declare type FIELD_TYPE_TEXT = 'text';
declare type FIELD_TYPE_NUMBER = 'number';
declare type FIELD_TYPE_HIDDEN = 'hidden';
declare type FIELD_TYPE_FILE = 'file';
declare type FIELD_TYPE_EMAIL = 'email';
declare type FIELD_TYPE_PASSWORD = 'password';
declare type FIELD_TYPE_CHECKBOX = 'checkbox';
declare type FIELD_TYPE_TEXTAREA = 'textarea';
declare type FIELD_TYPE_SELECT = 'select';
declare type FIELD_TYPE_ARRAY = 'array';
declare type FIELD_TYPE_OBJECT = 'object';
declare type MEDIA_TYPE_IMAGE = "image/jpg" | "image/jpeg" | "image/png" | "image/bmp" | "image/gif" | "image/svg+xml";
declare type MEDIA_TYPE_OCTET = 'application/octet-stream';
declare type MEDIA_TYPE_JSON = 'application/json';
declare type MEDIA_TYPE_HAL = 'application/hal+json';
declare type MEDIA_TYPE_FORM = 'application/x-www-form-urlencoded';
declare type MEDIA_TYPE_MULTIPART = 'multipart/form-data';
declare type MEDIA_TYPES = MEDIA_TYPE_MULTIPART | MEDIA_TYPE_FORM | MEDIA_TYPE_JSON | MEDIA_TYPE_HAL | MEDIA_TYPE_OCTET | MEDIA_TYPE_IMAGE;
declare type HTTP_GET = 'GET' | 'get';
declare type HTTP_POST = 'POST' | 'post';
declare type HTTP_PUT = 'PUT' | 'put';
declare type HTTP_DELETE = 'DELETE' | 'delete';
declare type HTTP_PATCH = 'PATCH' | 'patch';
declare type HTTP_METHODS = HTTP_GET | HTTP_POST | HTTP_PUT | HTTP_DELETE | HTTP_PATCH;
export interface IFieldObject {
    name: string;
    type: FIELD_TYPE_TEXT | FIELD_TYPE_NUMBER | FIELD_TYPE_HIDDEN | FIELD_TYPE_FILE | FIELD_TYPE_EMAIL | FIELD_TYPE_PASSWORD | FIELD_TYPE_CHECKBOX | FIELD_TYPE_TEXTAREA | FIELD_TYPE_SELECT | FIELD_TYPE_ARRAY | FIELD_TYPE_OBJECT;
    required?: boolean;
    default?: string | number | Array<string | number>;
    selected?: number;
    regex?: string;
    readonly?: boolean;
    schema?: string;
    maxLength?: number;
    minLength?: number;
    validationMessage?: string;
    error?: string;
    label?: string;
}
export interface IFormObject {
    action: string;
    method: HTTP_METHODS;
    type?: MEDIA_TYPES;
    fields?: IFieldObject[];
    error?: string;
    text?: string;
}
export interface IForm extends IFormObject {
    key: string;
    toJSON: () => any;
}
export default function Form(this: IForm, key: string, value: IFormObject): void;
export {};
