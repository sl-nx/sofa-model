import validate from 'validate.js';

export namespace Sofa {
  export interface Options {
    /** If any of your passed custom validation functions make asynchronous calls, this must be set to true. */
    async?: boolean;
    /** Here you can specify additional validation functions that are not included in Validate.js */
    customValidators?: Record<string, Function>;
    /** Validation is handled by Validate.js. Specify your validation constraints in options.validate when you instantiate your model.  */
    validate?: { [key: string]: Record<string, any> };
    /** Sanitize is handled mostly by Validate.js. `options.sanitize` is an object where the keys correspond to the data fields you want to process. The value is either an array of operations you want to apply or an object where is key is an operation and the value represents the options for that operation. */
    sanitize?: Record<string, string[] | Record<string, any>>;
    /** A list of fields that are allowed to be present in your output data. If the Whitelist option is specified, any field not specifically whitelisted will be removed. */
    whitelist?: string[];
    /** A list of fields that are not allowed in your output data. Any field specified under blacklist will be removed if present. */
    blacklist?: string[];
    /** An object where the keys are the fields you want to rename, and the values are what you want to change them to. */
    rename?: Record<string, string>;
    /** A list of static fields and their values that will be merged on top of your data. */
    static?: Record<string, any>;
    /** An object that will be merged behind your data. */
    merge?: any;
  }

  export interface AsyncOptions extends Options {
    /** If any of your passed custom validation functions make asynchronous calls, this must be set to true. */
    async: true;
  }

  export interface SyncOptions extends Options {
    /** If you're only providing synchronous validations and are not expecting a Promise as results, set to false. */
    async?: false;
  }

  interface Model {
    new (record: any): Model;

    results: any;
    validator: validate.ValidateJS;
    errors: any;

    process: Function;
    validate: Function;
    sanitize: Function;
    whitelist: Function;
    blacklist: Function;
    rename: Function;
    static: Function;
    merge: Function;
  }

  export interface AsyncModel extends Model {
    new (record: any): AsyncModel;

    /** Processes the passed record according to the initialized model options */
    process: () => Promise<any>;
    /** Validation is handled by Validate.js. Specify your validation constraints in options.validate when you instantiate your model.  */
    validate: () => Promise<any>;
    /** Sanitize is handled mostly by Validate.js. `options.sanitize` is an object where the keys correspond to the data fields you want to process. The value is either an array of operations you want to apply or an object where is key is an operation and the value represents the options for that operation. */
    sanitize: () => Promise<any>;
    /** A list of fields that are allowed to be present in your output data. If the Whitelist option is specified, any field not specifically whitelisted will be removed. */
    whitelist: () => Promise<any>;
    /** A list of fields that are not allowed in your output data. Any field specified under blacklist will be removed if present. */
    blacklist: () => Promise<any>;
    /** An object where the keys are the fields you want to rename, and the values are what you want to change them to. */
    rename: () => Promise<any>;
    /** A list of static fields and their values that will be merged on top of your data. */
    static: () => Promise<any>;
    /** An object that will be merged behind your data. */
    merge: () => Promise<any>;
  }

  export interface SyncModel extends Model {
    new (record: any): SyncModel;

    /** Processes the passed record according to the initialized model options */
    process: () => this;
    /** Validation is handled by Validate.js. Specify your validation constraints in options.validate when you instantiate your model.  */
    validate: () => this;
    /** Sanitize is handled mostly by Validate.js. `options.sanitize` is an object where the keys correspond to the data fields you want to process. The value is either an array of operations you want to apply or an object where is key is an operation and the value represents the options for that operation. */
    sanitize: () => this;
    /** A list of fields that are allowed to be present in your output data. If the Whitelist option is specified, any field not specifically whitelisted will be removed. */
    whitelist: () => this;
    /** A list of fields that are not allowed in your output data. Any field specified under blacklist will be removed if present. */
    blacklist: () => this;
    /** An object where the keys are the fields you want to rename, and the values are what you want to change them to. */
    rename: () => this;
    /** A list of static fields and their values that will be merged on top of your data. */
    static: () => this;
    /** An object that will be merged behind your data. */
    merge: () => this;
  }

  interface Factory extends Function {
    new (options: AsyncOptions): AsyncModel;
    (options: AsyncOptions): AsyncModel;

    new (options: SyncOptions): SyncModel;
    (options: SyncOptions): SyncModel;
  }
}

declare const SofaModel: Sofa.Factory;
export default SofaModel;
