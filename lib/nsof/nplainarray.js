(function() {
  var NXLong, _;

  _ = require('lodash');

  NXLong = require('./nxlong');

  module.exports = {
    encode: function(arrayObject) {
      var arrayHeader, encode, slotValues;
      encode = require('./index').encode;
      arrayHeader = new Buffer(1);
      arrayHeader.writeUInt8(5, 0);
      slotValues = _.map(arrayObject, function(val) {
        var isRoot;
        return encode(val, isRoot = false);
      });
      return Buffer.concat([arrayHeader, NXLong.encode(arrayObject.length)].concat(slotValues));
    },
    decode: function(buffer, precedents) {
      var arrayByteLength, arrayLength, decode, resArray;
      decode = require('./index').decode;
      arrayByteLength = 1;
      arrayLength = NXLong.decode(buffer.slice(1));
      arrayByteLength = arrayByteLength + arrayLength.bytesRead;
      resArray = new Array(arrayLength.value);
      _.forEach(resArray, function(value, key) {
        var isRoot, value_;
        value_ = decode(buffer.slice(arrayByteLength), precedents, isRoot = false);
        resArray[key] = value_.value;
        return arrayByteLength = arrayByteLength + value_.bytesRead;
      });
      return {
        value: resArray,
        bytesRead: arrayByteLength
      };
    }
  };

}).call(this);

//# sourceMappingURL=nplainarray.js.map
