(function() {
  module.exports = {
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

}).call(this);
