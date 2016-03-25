(function() {
  var NXlong;

  NXlong = require('./nxlong');

  module.exports = {
    encode: function(value) {
      throw new Error("encode Precedents not implemented yet");
    },
    decode: function(buffer, precedents) {
      var precedentId;
      precedentId = NXlong.decode(buffer.slice(1));
      return {
        value: precedents[precedentId.value].value,
        bytesRead: 1 + precedentId.bytesRead
      };
    }
  };

}).call(this);
