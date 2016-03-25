(function() {
  var NXLong;

  NXLong = require('./nxlong');

  module.exports = {
    encode: function(key) {
      var symbolHeader;
      symbolHeader = new Buffer(1);
      symbolHeader.writeUInt8(7, 0);
      return Buffer.concat([symbolHeader, NXLong.encode(key.length), Buffer(key, 'ascii')]);
    },
    decode: function(buffer) {
      var stringLength, stringVal;
      stringLength = NXLong.decode(buffer.slice(1));
      stringVal = buffer.slice(2, 2 + stringLength.value);
      return {
        value: stringVal.toString('ascii'),
        bytesRead: 1 + stringLength.bytesRead + stringLength.value
      };
    }
  };

}).call(this);
