(function() {
  var NArray, NBinary, NBoolean, NFrame, NImmediate, NKPrecedent, NNIL, NPlainArray, NString, NSymbol, NUniChar, NXlong, NkCharacter, Utils, _;

  _ = require('lodash');

  Utils = require('../utils');

  NXlong = require('./nxlong');

  NBoolean = require('./nboolean');

  NNIL = require('./nnil');

  NkCharacter = require('./nkcharacter');

  NUniChar = require('./nunichar');

  NBinary = require('./nbinary');

  NImmediate = require('./nimmediate');

  NSymbol = require('./nsymbol');

  NString = require('./nstring');

  NKPrecedent = require('./nkprecedent');

  NArray = require('./narray');

  NPlainArray = require('./nplainarray');

  NFrame = require('./nframe');


  /**
      (NSOF) Newton Streamed Object encoding / decoding
   */

  module.exports = {
    encode: function(value, isRoot) {
      var encodedValue, type, versionHeader;
      if (isRoot == null) {
        isRoot = true;
      }
      type = typeof value;
      encodedValue = (function() {
        switch (type) {
          case 'string':
            return NString.encode(value);
          case 'number':
            return NImmediate.encode(value, 'integer');
          case 'boolean':
            return NImmediate.encode(value, 'boolean');
          case 'object':
            if (value === null) {
              NNIL.encode();
            }
            if (value instanceof Array) {
              return NPlainArray.encode(value);
            } else {
              return NFrame.encode(value);
            }
            break;
          default:
            if (value == null) {
              return NNIL.encode();
            } else {
              throw new Error("encoding NSOF type '" + type + "' not implemented yet");
            }
        }
      })();
      if (isRoot) {
        versionHeader = new Buffer([0x02]);
        return Buffer.concat([versionHeader, encodedValue]);
      } else {
        return encodedValue;
      }
    },
    decode: function(buffer, precedents, isRoot) {
      var ntype, result;
      if (precedents == null) {
        precedents = [];
      }
      if (isRoot == null) {
        isRoot = true;
      }
      if (isRoot) {
        buffer = buffer.slice(1);
      }
      ntype = buffer[0];
      result = (function() {
        switch (ntype) {
          case 0:
            if (buffer[1] === 0x1A) {
              return NBoolean.decode(buffer);
            } else if (buffer[1] === 2) {
              return NNIL.decode();
            } else {
              return NImmediate.decode(buffer);
            }
            break;
          case 1:
            return NkCharacter.decode(buffer);
          case 2:
            return NUniChar.decode(buffer);
          case 3:
            return NBinary.decode(buffer, precedents);
          case 4:
            return NArray.decode(buffer, precedents);
          case 5:
            return NPlainArray.decode(buffer, precedents);
          case 6:
            return NFrame.decode(buffer, precedents);
          case 7:
            return NSymbol.decode(buffer);
          case 8:
            return NString.decode(buffer);
          case 9:
            return NKPrecedent.decode(buffer, precedents);
          case 10:
            return NNIL.decode();
          default:
            throw new Error("decoding NSOF type '" + ntype + "' not implemented yet");
        }
      })();
      precedents.push(result);
      if (isRoot) {
        return result.value;
      } else {
        return result;
      }
    }
  };

}).call(this);
