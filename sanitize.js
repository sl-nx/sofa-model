const validator = require('validator'),
  utils = require('./utils');

const append = function (data, options) {
  if (typeof data === 'undefined') {
    return;
  }
  let str = '';
  if (typeof options !== 'undefined') {
    str = str + options;
  }
  return data + str;
};

const prepend = function (data, options) {
  if (typeof data === 'undefined') {
    return;
  }
  let str = '';
  if (typeof options !== 'undefined') {
    str = str + options;
  }
  return str + data;
};

const upperCase = function (data) {
  return data.toString().toUpperCase();
};

const lowerCase = function (data) {
  return data.toString().toLowerCase();
};

const titleCase = function (data) {
  return data.toString().replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

const sanitizeFunctions = {
  toString: validator.toString,
  toDate: validator.toDate,
  toFloat: validator.toFloat,
  toInt: validator.toInt,
  toBoolean: validator.toBoolean,
  trim: validator.trim,
  escape: validator.escape,
  stripLow: validator.stripLow,
  whiteList: validator.whitelist,
  blackList: validator.blacklist,
  normalizeEmail: validator.normalizeEmail,
  append: append,
  prepend: prepend,
  toUpperCase: upperCase,
  toLowerCase: lowerCase,
  toTitleCase: titleCase
};

const sanitizeField = function (data, fn, options) {
  if (typeof sanitizeFunctions[fn] === 'function') {
    return sanitizeFunctions[fn].call(null, data, options);
  } else {
    throw new Error('Sanitize function ' + fn + " doesn't exist.");
  }
};

module.exports = function (doc, settings, sanitizers) {
  // Add any custom sanitize functions that are supplied
  if (typeof sanitizers === 'object') {
    for (const sanitizer in sanitizers) {
      if (
        Object.prototype.hasOwnProperty.call(sanitizers, sanitizer) &&
        typeof sanitizers[sanitizer] === 'function'
      ) {
        sanitizeFunctions[sanitizer] = sanitizers[sanitizer];
      }
    }
  }
  // Process each key listed in the sanitize options
  for (const key in settings) {
    if (Object.prototype.hasOwnProperty.call(settings, key)) {
      const thisOp = settings[key];
      let output = utils.getObjectRef(doc, key);
      let opArray, func;
      if (typeof output !== 'undefined') {
        if (utils.isArray(thisOp)) {
          opArray = thisOp;
        } else {
          const arr = [];
          arr[0] = thisOp;
          opArray = arr;
        }
        for (let x = 0; x < opArray.length; x++) {
          if (typeof opArray[x] === 'string') {
            func = opArray[x];
            output = sanitizeField(output, func);
          } else if (typeof opArray[x] === 'object') {
            for (const op in opArray[x]) {
              if (Object.prototype.hasOwnProperty.call(opArray[x], op)) {
                func = op;
                output = sanitizeField(output, func, opArray[x][op]);
              }
            }
          }
        }
        utils.setObjectRef(doc, key, output);
      }
    }
  }
  return doc;
};
