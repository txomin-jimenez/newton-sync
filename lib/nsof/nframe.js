(function() {
  var NSymbol, NXlong, _;

  _ = require('lodash');

  NXlong = require('./nxlong');

  NSymbol = require('./nsymbol');

  module.exports = {
    encode: function(object) {
      var encode, frameHeader, keyCount, slotTags, slotValues;
      encode = require('./index').encode;
      keyCount = _.size(object);
      frameHeader = new Buffer(1);
      frameHeader.writeUInt8(6, 0);
      slotTags = [];
      slotValues = [];
      _.forEach(object, function(value, key) {
        var isRoot;
        slotTags.push(NSymbol.encode(key));
        return slotValues.push(encode(value, isRoot = false));
      });
      return Buffer.concat([frameHeader, NXlong.encode(keyCount)].concat(slotTags, slotValues));
    },
    decode: function(buffer, precedents) {
      var decode, keyArray, keyLength, objByteLength, resObj;
      decode = require('./index').decode;
      objByteLength = 1;
      keyLength = NXlong.decode(buffer.slice(1));
      objByteLength = objByteLength + keyLength.bytesRead;
      keyArray = new Array(keyLength.value);
      _.forEach(keyArray, function(value, key) {
        var isRoot, value_;
        value_ = decode(buffer.slice(objByteLength), precedents, isRoot = false);
        keyArray[key] = value_.value;
        return objByteLength = objByteLength + value_.bytesRead;
      });
      resObj = {};
      _.forEach(keyArray, function(keyName) {
        var isRoot, value_;
        value_ = decode(buffer.slice(objByteLength), precedents, isRoot = false);
        resObj[keyName] = value_.value;
        return objByteLength = objByteLength + value_.bytesRead;
      });
      return {
        value: resObj,
        bytesRead: objByteLength
      };
    }
  };

}).call(this);
