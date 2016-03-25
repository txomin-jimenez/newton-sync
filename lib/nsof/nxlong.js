(function() {
  module.exports = {
    encode: function(numberVal) {
      var bufA, bufB;
      if (numberVal >= 0 && numberVal <= 254) {
        return new Buffer([numberVal]);
      } else {
        bufA = new Buffer([0xFF]);
        bufB = new Buffer(4);
        bufB.writeInt32BE(numberVal, 0);
        return Buffer.concat([bufA, bufB]);
      }
    },
    decode: function(buffer) {
      if (buffer[0] === 0xFF) {
        return {
          value: buffer.readInt32BE(1),
          bytesRead: 5
        };
      } else {
        return {
          value: buffer[0],
          bytesRead: 1
        };
      }
    }
  };

}).call(this);
