(function() {
  var Utils, _, cast, toArray, toBoolean, toFrame, toImmediate, toNIL, toString, toSymbol;

  _ = require('lodash');

  Utils = require('./utils');

  toSymbol = (function(_this) {
    return function(key) {
      var symbolHeader;
      symbolHeader = new Buffer(2);
      if (key.length > 254) {
        throw new Error("not implemented yet");
      }
      symbolHeader.writeUInt8(7, 0);
      symbolHeader.writeUInt8(key.length, 1);
      return Buffer.concat([symbolHeader, new Buffer(key, 'ascii')]);
    };
  })(this);

  toImmediate = function(numberVal) {
    return new Buffer([0x00, numberVal << 2]);
  };

  toBoolean = function(value) {
    if (value) {
      return new Buffer([0x00, 0x1a]);
    } else {
      return new Buffer([0x00, 0x00]);
    }
  };

  toNIL = function() {
    return new Buffer([0x00, 2]);
  };

  toString = function(stringVal) {
    var stringHeader, unicharValue;
    unicharValue = Utils.unichar.toUniCharBuffer(stringVal);
    if (unicharValue.length > 254) {
      throw new Error("not implemented yet");
    }
    stringHeader = new Buffer(2);
    stringHeader.writeUInt8(8, 0);
    stringHeader.writeUInt8(unicharValue.length, 1);
    return Buffer.concat([stringHeader, unicharValue]);
  };

  cast = function(value) {
    switch (typeof value) {
      case 'string':
        return toString(value);
      case 'number':
        return toImmediate(value);
      case 'boolean':
        return toBoolean(value);
      case 'object':
        if (value === null) {
          toNIL();
        }
        if (value instanceof Array) {
          return toArray(value);
        } else {
          return toFrame(value);
        }
        break;
      default:
        throw new Error("not implemented yet");
    }
  };

  toArray = function(arrayObject) {
    var arrayHeader, slotValues;
    arrayHeader = new Buffer(2);
    arrayHeader.writeUInt8(5, 0);
    arrayHeader.writeUInt8(arrayObject.length, 1);
    slotValues = _.map(arrayObject, cast);
    return Buffer.concat([arrayHeader].concat(slotValues));
  };

  toFrame = function(object) {
    var frameHeader, keyCount, slotTags, slotValues;
    keyCount = _.size(object);
    if (keyCount > 254) {
      throw new Error("not implemented yet");
    }
    frameHeader = new Buffer(2);
    frameHeader.writeUInt8(6, 0);
    frameHeader.writeUInt8(keyCount, 1);
    slotTags = [];
    slotValues = [];
    _.forEach(object, function(value, key) {
      slotTags.push(toSymbol(key));
      return slotValues.push(cast(value));
    });
    return Buffer.concat([frameHeader].concat(slotTags, slotValues));
  };

  module.exports = {
    fromValue: function(value) {
      var versionHeader;
      versionHeader = new Buffer([0x02]);
      return Buffer.concat([versionHeader, cast(value)]);
    }
  };

}).call(this);
