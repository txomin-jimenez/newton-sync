(function() {
  var NXlong, Utils;

  Utils = require('../utils');

  NXlong = require('./nxlong');

  module.exports = {
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

}).call(this);
