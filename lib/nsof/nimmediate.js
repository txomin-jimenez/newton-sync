(function() {
  var NXlong;

  NXlong = require('./nxlong');

  module.exports = {
    encode: function(ref, type) {
      var value;
      if (type == null) {
        type = 'integer';
      }
      value = (function() {
        switch (type) {
          case 'integer':
            return NXlong.encode(ref << 2);
          case 'boolean':
            if (ref) {
              return new Buffer([0x1A]);
            } else {
              return new Buffer([0]);
            }
            break;
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
      decodedLong = NXlong.decode(buffer.slice(1));
      if (decodedLong.value === 0x1A) {
        decodedLong.value = true;
      } else {
        decodedLong.value = decodedLong.value >> 2;
      }
      decodedLong.bytesRead = decodedLong.bytesRead + 1;
      return decodedLong;
    }
  };

}).call(this);
