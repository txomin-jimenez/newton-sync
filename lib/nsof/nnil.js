(function() {
  module.exports = {
    encode: function() {
      return new Buffer('0a', 'hex');
    },
    decode: function(buffer) {
      return {
        value: null,
        bytesRead: 1
      };
    }
  };

}).call(this);

//# sourceMappingURL=nnil.js.map
