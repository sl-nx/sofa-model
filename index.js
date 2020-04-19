const validate = require('validate.js'),
  merge = require('deepmerge'),
  sanitize = require('./sanitize'),
  utils = require('./utils');

module.exports = function (options) {
  const whitelist = (doc, list) => {
    const results = {};
    for (const item in list) {
      const selected = utils.getObjectRef(doc, list[item]);
      if (typeof selected !== 'undefined') {
        utils.setObjectRef(results, list[item], selected);
      }
    }
    return results;
  };

  const blacklist = (doc, list) => {
    for (const item in list) {
      const selected = utils.getObjectRef(doc, item);
      if (typeof selected !== 'undefined') {
        utils.delObjectRef(doc, item);
      }
    }
    return doc;
  };

  const rename = (doc, list) => {
    for (const item in list) {
      const selected = utils.getObjectRef(doc, item);
      if (typeof selected !== 'undefined') {
        utils.setObjectRef(doc, list[item], selected);
        utils.delObjectRef(doc, item);
      }
    }
    return doc;
  };

  const deepClone = obj => {
    return JSON.parse(JSON.stringify(obj));
  };

  class SofaModel {
    constructor(record) {
      this.results = deepClone(record);
      this.validator = validate;
      this.errors = null;

      const customValidators = options.customValidators || {};
      for (const validator in customValidators) {
        if (
          Object.prototype.hasOwnProperty.call(customValidators, validator) &&
          typeof customValidators[validator] === 'function'
        ) {
          this.validator.validators[validator] = customValidators[validator];
        }
      }
    }

    validate() {
      if (typeof options.validate !== 'object') {
        return this;
      }
      if (options.async) {
        return new Promise((resolve, reject) => {
          validate
            .async(this.results, options.validate, options.valOptions || {})
            .then(
              () => {
                resolve(this.results);
              },
              err => {
                this.errors = err;
                reject(err);
              }
            );
        });
      } else {
        this.errors =
          validate(this.results, options.validate, options.valOptions || {}) ||
          null;
        return this;
      }
    }

    sanitize() {
      if (options.sanitize) {
        this.results = sanitize(
          this.results,
          options.sanitize || {},
          options.customSanitizers || {}
        );
      }
      if (options.async) {
        return Promise.resolve(this.results);
      } else {
        return this;
      }
    }

    whitelist() {
      if (options.whitelist) {
        this.results = whitelist(this.results, options.whitelist);
      }
      if (options.async) {
        return Promise.resolve(this.results);
      } else {
        return this;
      }
    }

    blacklist() {
      if (options.blacklist) {
        this.results = blacklist(this.results, options.blacklist);
      }
      if (options.async) {
        return Promise.resolve(this.results);
      } else {
        return this;
      }
    }

    rename() {
      if (options.rename) {
        this.results = rename(this.results, options.rename);
      }
      if (options.async) {
        return Promise.resolve(this.results);
      } else {
        return this;
      }
    }
    static() {
      if (options.static) {
        this.results = merge(this.results, options.static);
      }
      if (options.async) {
        return Promise.resolve(this.results);
      } else {
        return this;
      }
    }

    merge(doc) {
      this.results = merge(doc, this.results);
      if (options.async) {
        return Promise.resolve(this.results);
      } else {
        return this;
      }
    }

    process() {
      if (options.async) {
        return this.whitelist()
          .then(() => this.blacklist())
          .then(() => this.sanitize())
          .then(() => this.validate())
          .then(() => this.rename())
          .then(() => this.static());
      } else {
        return this.whitelist()
          .blacklist()
          .sanitize()
          .validate()
          .rename()
          .static();
      }
    }
  }

  return SofaModel;
};
