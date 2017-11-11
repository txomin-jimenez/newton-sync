(function() {
  var NXLong, Utils;

  Utils = require('../utils');

  NXLong = require('./nxlong');

  module.exports = {
    encode: function(value) {
      var encode;
      encode = require('./index').encode;
      throw new Error("encode Large Binary not implemented yet");
    },
    decode: function(buffer, precedents) {
      var binaryClass, binaryData, binaryLength, bytesRead_, companderName, companderNameLength, companderParams, companderParamsLength, compressed, decode, isRoot, reservedIgnore;
      decode = require('./index').decode;
      bytesRead_ = 1;
      binaryClass = decode(buffer.slice(bytesRead_), precedents, isRoot = false);
      bytesRead_ = bytesRead_ + binaryClass.bytesRead;
      compressed = buffer.slice(bytesRead_)[0];
      bytesRead_ = bytesRead_ + 1;
      binaryLength = NXLong.decode(buffer.slice(bytesRead_));
      bytesRead_ = bytesRead_ + binaryLength.bytesRead;
      companderNameLength = NXLong.decode(buffer.slice(bytesRead_));
      bytesRead_ = bytesRead_ + companderNameLength.bytesRead;
      companderParamsLength = NXLong.decode(buffer.slice(bytesRead_));
      bytesRead_ = bytesRead_ + companderParamsLength.bytesRead;
      reservedIgnore = NXLong.decode(buffer.slice(bytesRead_));
      bytesRead_ = bytesRead_ + reservedIgnore.bytesRead;
      companderName = buffer.slice(bytesRead_, bytesRead_ + companderNameLength.value).toString('ascii');
      bytesRead_ = bytesRead_ + companderNameLength.value;
      companderParams = buffer.slice(bytesRead_, bytesRead_ + companderParamsLength.value);
      bytesRead_ = bytesRead_ + companderParamsLength.value;
      binaryData = buffer.slice(bytesRead_, bytesRead_ + binaryLength.value);
      bytesRead_ = bytesRead_ + binaryLength.value;
      return {
        value: {
          _binaryClass: binaryClass.value,
          _compander: {
            name: companderName,
            params: companderParams
          },
          _binaryData: binaryData
        },
        bytesRead: bytesRead_
      };
    }
  };

}).call(this);

//# sourceMappingURL=nlargebinary.js.map
