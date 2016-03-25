(function() {
  module.exports = {
    encode: function() {
      return new Buffer([0x10]);
    },
    decode: function(buffer) {
      return {
        value: null,
        bytesRead: 1
      };
    }
  };

}).call(this);
