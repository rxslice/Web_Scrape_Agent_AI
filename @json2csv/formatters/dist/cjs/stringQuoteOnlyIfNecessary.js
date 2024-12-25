var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var stringQuoteOnlyIfNecessary_exports = {};
__export(stringQuoteOnlyIfNecessary_exports, {
  default: () => stringQuoteOnlyIfNecessaryFormatter
});
module.exports = __toCommonJS(stringQuoteOnlyIfNecessary_exports);
var import_string = __toESM(require("./string.js"));
function stringQuoteOnlyIfNecessaryFormatter(opts = {}) {
  const quote = typeof opts.quote === "string" ? opts.quote : '"';
  const escapedQuote = typeof opts.escapedQuote === "string" ? opts.escapedQuote : `${quote}${quote}`;
  const separator = typeof opts.separator === "string" ? opts.separator : ",";
  const eol = typeof opts.eol === "string" ? opts.eol : "\n";
  const stringFormatter = (0, import_string.default)({ quote, escapedQuote });
  return (value) => {
    if ([quote, separator, eol].some((char) => value.includes(char))) {
      return stringFormatter(value);
    }
    return value;
  };
}
