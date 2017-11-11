(function() {
  module.exports = {
    encode: function(value) {
      if (value) {
        return new Buffer('1a', 'hex');
      } else {
        return new Buffer('00', 'hex');
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

//# sourceMappingURL=nboolean.js.map
