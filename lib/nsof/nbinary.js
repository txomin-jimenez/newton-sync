(function() {
  var NXLong, Utils;

  Utils = require('../utils');

  NXLong = require('./nxlong');

  module.exports = {
    encode: function(value) {
      var encode;
      encode = require('./index').encode;
      throw new Error("encode Binary not implemented yet");
    },
    decode: function(buffer, precedents) {
      var binaryClass, binaryData, binaryLength, bytesRead_, decode, isRoot;
      decode = require('./index').decode;
      bytesRead_ = 1;
      binaryLength = NXlong.decode(buffer.slice(1));
      bytesRead_ = bytesRead_ + binaryLength.bytesRead;
      binaryClass = decode(buffer.slice(bytesRead_), precedents, isRoot = false);
      bytesRead_ = bytesRead_ + binaryClass.bytesRead;
      binaryData = buffer.slice(bytesRead_, bytesRead_ + binaryLength.value);
      bytesRead_ = bytesRead_ + binaryLength.value;
      return {
        value: {
          _binaryClass: binaryClass.value,
          _binaryData: Utils.unichar.toString(binaryData)
        },
        bytesRead: bytesRead_
      };
    }
  };

}).call(this);
