(function() {
  var Iconv, _, unicharDecode, unicharEncode;

  _ = require('lodash');

  Iconv = require('iconv').Iconv;

  unicharDecode = new Iconv('UTF-16BE', 'UTF-8');

  unicharEncode = new Iconv('UTF-8', 'UTF-16BE');

  module.exports = {
    Enum: function() {
      var i, self, values;
      values = arguments;
      self = {
        all: [],
        keys: values
      };
      i = 0;
      while (i < values.length) {
        self[values[i]] = i;
        self.all[i] = i;
        i++;
      }
      return self;
    },
    ByteEnum: function() {
      var i, self, values;
      values = arguments;
      self = {
        all: [],
        keys: values
      };
      i = 0;
      while (i < values.length) {
        self[values[i]] = 1 << i;
        self.all[1 << i] = i;
        i++;
      }
      return self;
    },
    unichar: {
      toString: function(uniCharBuff) {
        return unicharDecode.convert(uniCharBuff).toString('utf8').slice(0, -1);
      },
      toUniCharBuffer: function(text) {
        return unicharEncode.convert(text + "\u0000");
      }
    }
  };

}).call(this);
