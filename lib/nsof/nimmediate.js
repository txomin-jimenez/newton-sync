(function() {
  var NBoolean, NXLong;

  NXLong = require('./nxlong');

  NBoolean = require('./nboolean');

  module.exports = {
    encode: function(ref, type) {
      var value;
      if (type == null) {
        type = 'integer';
      }
      value = (function() {
        switch (type) {
          case 'integer':
            return NXLong.encode(ref << 2);
          case 'boolean':
            return NBoolean.encode(ref);
          case 'nil':
            return new Buffer([2]);
          default:
            throw new Error(type + " not implemented yet");
        }
      })();
      return Buffer.concat([new Buffer([0x00]), value]);
    },
    decode: function(buffer) {
      var decodedLong;
      if (buffer[1] === 0x1A) {
        return NBoolean.decode(buffer);
      } else if (buffer[1] === 2) {
        return NNIL.decode();
      } else {
        decodedLong = NXLong.decode(buffer.slice(1));
        decodedLong.value = decodedLong.value >> 2;
        decodedLong.bytesRead = decodedLong.bytesRead + 1;
        return decodedLong;
      }
    }
  };

}).call(this);

//# sourceMappingURL=nimmediate.js.map
