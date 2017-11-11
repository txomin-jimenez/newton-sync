(function() {
  var Iconv, _, moment, unicharDecode, unicharEncode;

  _ = require('lodash');

  moment = require('moment');

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
    },
    newtonTime: {
      toJSON: function(minutesSince1904) {
        return moment('1904-01-01T00:00:00.000Z').add(minutesSince1904, 'minutes').toJSON();
      },
      "new": function(newDate) {
        if (!(newDate instanceof moment)) {
          newDate = moment(newDate);
        }
        return newDate.diff(moment('1904-01-01T00:00:00.000Z'), 'minutes');
      }
    }
  };

}).call(this);

//# sourceMappingURL=utils.js.map
