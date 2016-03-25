(function() {
  var NXlong, _;

  _ = require('lodash');

  NXlong = require('./nxlong');

  module.exports = {
    encode: function(value) {
      var encode;
      encode = require('./index').encode;
      console.log(value);
      throw new Error("encode NArray not implemented yet");
    },
    decode: function(buffer, precedents, decode) {
      var arrayByteLength, arrayClass, arrayLength, isRoot, resArray;
      decode = require('./index').decode;
      arrayByteLength = 1;
      arrayLength = NXlong.decode(buffer.slice(1));
      arrayByteLength = arrayByteLength + arrayLength.bytesRead;
      arrayClass = decode(buffer.slice(arrayByteLength), precedents, isRoot = false);
      arrayByteLength = arrayByteLength + arrayClass.bytesRead;
      resArray = new Array(arrayLength.value);
      _.forEach(resArray, function(value, key) {
        var value_;
        value_ = decode(buffer.slice(arrayByteLength), precedents, isRoot = false);
        resArray[key] = value_.value;
        return arrayByteLength = arrayByteLength + value_.bytesRead;
      });
      return {
        value: {
          _arrayClass: arrayClass.value,
          _arrayData: resArray
        },
        bytesRead: arrayByteLength
      };
    }
  };

}).call(this);
