(function() {
  var NArray, NBoolean, NFrame, NImmediate, NNIL, NString, NSymbol, NXlong, Utils, _, decode, encode;

  _ = require('lodash');

  Utils = require('./utils');

  NXlong = {
    encode: function(numberVal) {
      var bufA, bufB;
      if (numberVal >= 0 && numberVal <= 254) {
        return new Buffer([numberVal]);
      } else {
        bufA = new Buffer([0xFF]);
        bufB = new Buffer(4);
        bufB.writeInt32BE(numberVal, 0);
        return Buffer.concat([bufA, bufB]);
      }
    },
    decode: function(buffer) {
      if (buffer[0] === 0xFF) {
        return {
          value: buffer.readInt32BE(1),
          bytesRead: 5
        };
      } else {
        return {
          value: buffer[0],
          bytesRead: 1
        };
      }
    }
  };

  NBoolean = {
    encode: function(value) {
      if (value) {
        return new Buffer([0x00, 0x1a]);
      } else {
        return new Buffer([0x00, 0x00]);
      }
    },
    decode: function(buffer) {
      var boolValue;
      boolValue = false;
      if (buffer[1] === 0x1A) {
        boolValue = true;
      }
      return {
        value: boolValue,
        bytesRead: 2
      };
    }
  };

  NNIL = {
    encode: function() {
      return new Buffer([0x00, 2]);
    },
    decode: function(buffer) {
      return {
        value: null,
        bytesRead: 2
      };
    }
  };

  NImmediate = {
    encode: function(ref) {
      return Buffer.concat([new Buffer([0x00]), NXlong.encode(ref << 2)]);
    },
    decode: function(buffer) {
      var decodedLong;
      decodedLong = NXlong.decode(buffer.slice(1));
      decodedLong.value = decodedLong.value >> 2;
      decodedLong.bytesRead = decodedLong.bytesRead + 1;
      return decodedLong;
    }
  };

  NSymbol = {
    encode: function(key) {
      var symbolHeader;
      symbolHeader = new Buffer(1);
      symbolHeader.writeUInt8(7, 0);
      return Buffer.concat([symbolHeader, NXlong.encode(key.length), Buffer(key, 'ascii')]);
    },
    decode: function(buffer) {
      var stringLength, stringVal;
      stringLength = NXlong.decode(buffer.slice(1));
      stringVal = buffer.slice(2, 2 + stringLength.value);
      return {
        value: stringVal,
        bytesRead: 1 + stringLength.bytesRead + stringLength.value
      };
    }
  };

  NString = {
    encode: function(stringVal) {
      var stringHeader, unicharValue;
      unicharValue = Utils.unichar.toUniCharBuffer(stringVal);
      stringHeader = new Buffer(1);
      stringHeader.writeUInt8(8, 0);
      return Buffer.concat([stringHeader, NXlong.encode(unicharValue.length), unicharValue]);
    },
    decode: function(buffer) {
      var binaryValue, stringLengthXlong;
      stringLengthXlong = NXlong.decode(buffer.slice(1));
      binaryValue = buffer.slice(2, 2 + stringLengthXlong.value);
      return {
        value: Utils.unichar.toString(binaryValue),
        bytesRead: 1 + stringLengthXlong.bytesRead + stringLengthXlong.value
      };
    }
  };

  NArray = {
    encode: function(arrayObject) {
      var arrayHeader, slotValues;
      arrayHeader = new Buffer(1);
      arrayHeader.writeUInt8(5, 0);
      slotValues = _.map(arrayObject, encode);
      return Buffer.concat([arrayHeader, NXlong.encode(arrayObject.length)].concat(slotValues));
    },
    decode: function(buffer) {
      var arrayByteLength, arrayLength, resArray;
      arrayByteLength = 1;
      arrayLength = NXlong.decode(buffer.slice(1));
      arrayByteLength = arrayByteLength + arrayLength.bytesRead;
      resArray = new Array(arrayLength.value);
      _.forEach(resArray, function(value, key) {
        var value_;
        value_ = decode(buffer.slice(arrayByteLength));
        resArray[key] = value_.value;
        return arrayByteLength = arrayByteLength + value_.bytesRead;
      });
      return {
        value: resArray,
        bytesRead: arrayByteLength
      };
    }
  };

  NFrame = {
    encode: function(object) {
      var frameHeader, keyCount, slotTags, slotValues;
      keyCount = _.size(object);
      frameHeader = new Buffer(1);
      frameHeader.writeUInt8(6, 0);
      slotTags = [];
      slotValues = [];
      _.forEach(object, function(value, key) {
        slotTags.push(NSymbol.encode(key));
        return slotValues.push(encode(value));
      });
      return Buffer.concat([frameHeader, NXlong.encode(keyCount)].concat(slotTags, slotValues));
    },
    decode: function(buffer) {
      var keyArray, keyLength, objByteLength, resObj;
      objByteLength = 1;
      keyLength = NXlong.decode(buffer.slice(1));
      objByteLength = objByteLength + keyLength.bytesRead;
      keyArray = new Array(keyLength.value);
      _.forEach(keyArray, function(value, key) {
        var value_;
        value_ = decode(buffer.slice(objByteLength));
        keyArray[key] = value_.value;
        return objByteLength = objByteLength + value_.bytesRead;
      });
      resObj = {};
      _.forEach(keyArray, function(keyName) {
        var value_;
        value_ = decode(buffer.slice(objByteLength));
        resObj[keyName] = value_.value;
        return objByteLength = objByteLength + value_.bytesRead;
      });
      return {
        value: resObj,
        bytesRead: objByteLength
      };
    }
  };

  encode = function(value) {
    switch (typeof value) {
      case 'string':
        return NString.encode(value);
      case 'number':
        return NImmediate.encode(value);
      case 'boolean':
        return NBoolean.encode(value);
      case 'object':
        if (value === null) {
          NNIL.encode();
        }
        if (value instanceof Array) {
          return NArray.encode(value);
        } else {
          return NFrame.encode(value);
        }
        break;
      default:
        throw new Error("not implemented yet");
    }
  };

  decode = function(buffer) {
    var ntype;
    ntype = buffer[0];
    switch (ntype) {
      case 7:
        return NSymbol.decode(buffer);
      case 8:
        return NString.decode(buffer);
      case 0:
        if (buffer[1] === 0x1A) {
          return NBoolean.decode(buffer);
        } else if (buffer[1] === 2) {
          return NNIL.decode();
        } else {
          return NImmediate.decode(buffer);
        }
        break;
      case 6:
        return NFrame.decode(buffer);
      case 5:
        return NArray.decode(buffer);
      default:
        throw new Error(ntype + " not implemented yet");
    }
  };

  module.exports = {
    encode: function(value) {
      var versionHeader;
      versionHeader = new Buffer([0x02]);
      return Buffer.concat([versionHeader, encode(value)]);
    },
    decode: function(buffer) {
      return decode(buffer.slice(1)).value;
    }
  };

}).call(this);
