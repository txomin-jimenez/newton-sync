(function() {
  var Utils, _, cast, toArray, toBoolean, toFrame, toImmediate, toNIL, toString, toSymbol, toXlong;

  _ = require('lodash');

  Utils = require('./utils');

  toXlong = function(numberVal) {
    var bufA, bufB;
    if (numberVal >= 0 && numberVal <= 254) {
      return new Buffer([numberVal]);
    } else {
      bufA = new Buffer([0xFF]);
      bufB = new Buffer(4);
      bufB.writeInt32BE(numberVal, 0);
      return Buffer.concat([bufA, bufB]);
    }
  };

  toSymbol = function(key) {
    var symbolHeader;
    symbolHeader = new Buffer(1);
    symbolHeader.writeUInt8(7, 0);
    return Buffer.concat([symbolHeader, toXlong(key.length), Buffer(key, 'ascii')]);
  };

  toImmediate = function(ref) {
    return Buffer.concat([new Buffer([0x00]), toXlong(ref << 2)]);
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
    stringHeader = new Buffer(1);
    stringHeader.writeUInt8(8, 0);
    return Buffer.concat([stringHeader, toXlong(unicharValue.length), unicharValue]);
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
    arrayHeader = new Buffer(1);
    arrayHeader.writeUInt8(5, 0);
    slotValues = _.map(arrayObject, cast);
    return Buffer.concat([arrayHeader, toXlong(arrayObject.length)].concat(slotValues));
  };

  toFrame = function(object) {
    var frameHeader, keyCount, slotTags, slotValues;
    keyCount = _.size(object);
    frameHeader = new Buffer(1);
    frameHeader.writeUInt8(6, 0);
    slotTags = [];
    slotValues = [];
    _.forEach(object, function(value, key) {
      slotTags.push(toSymbol(key));
      return slotValues.push(cast(value));
    });
    return Buffer.concat([frameHeader, toXlong(keyCount)].concat(slotTags, slotValues));
  };

  module.exports = {
    fromValue: function(value) {
      var versionHeader;
      versionHeader = new Buffer([0x02]);
      return Buffer.concat([versionHeader, cast(value)]);
    }
  };

}).call(this);
