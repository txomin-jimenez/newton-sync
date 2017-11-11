(function() {
  var Utils;

  Utils = require('../utils');

  module.exports = {
    encode: function(value) {
      throw new Error("encode UniChar not implemented yet");
    },
    decode: function(buffer) {
      var binaryValue;
      binaryValue = buffer.slice(1, 3);
      return {
        value: Utils.unichar.toString(binaryValue),
        bytesRead: 3
      };
    }
  };

}).call(this);

//# sourceMappingURL=nunichar.js.map
