(function() {
  var NSymbol, NXLong, Utils;

  Utils = require('../utils');

  NXLong = require('./nxlong');

  NSymbol = require('./nsymbol');

  module.exports = {
    encode: function(value) {
      var binaryData, frameHeader;
      frameHeader = new Buffer(1);
      frameHeader.writeUInt8(3, 0);
      if (typeof value.toBinary === 'function') {
        binaryData = value.toBinary();
      } else if (value._binaryData instanceof Buffer) {
        binaryData = value._binaryData;
      } else {
        binaryData = Utils.unichar.toUniCharBuffer(value._binaryData);
      }
      return Buffer.concat([frameHeader, NXLong.encode(binaryData.length), NSymbol.encode(value._binaryClass), binaryData]);
    },
    decode: function(buffer, precedents) {
      var binaryClass, binaryData, binaryLength, bytesRead_, decode, isRoot;
      decode = require('./index').decode;
      bytesRead_ = 1;
      binaryLength = NXLong.decode(buffer.slice(1));
      bytesRead_ = bytesRead_ + binaryLength.bytesRead;
      binaryClass = decode(buffer.slice(bytesRead_), precedents, isRoot = false);
      bytesRead_ = bytesRead_ + binaryClass.bytesRead;
      binaryData = buffer.slice(bytesRead_, bytesRead_ + binaryLength.value);
      bytesRead_ = bytesRead_ + binaryLength.value;
      return {
        value: {
          _binaryClass: binaryClass.value,
          _binaryData: binaryData
        },
        bytesRead: bytesRead_
      };
    }
  };

}).call(this);

//# sourceMappingURL=nbinary.js.map
