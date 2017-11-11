(function() {
  module.exports = {
    encode: function(value) {
      throw new Error("encode kCharacter not implemented yet");
    },
    decode: function(buffer) {
      return {
        value: String.fromCharCode(buffer[0]),
        bytesRead: 2
      };
    }
  };

}).call(this);

//# sourceMappingURL=nkcharacter.js.map
