(function() {
  module.exports = {
    protocol: {
      getCommandId: function(buffer) {
        return buffer.toString('ascii', 8, 12);
      },
      parseData: function(buffer) {
        var length;
        length = buffer.readUInt32BE(12);
        console.log(buffer.readUInt32BE(16));
        return {};
      },
      toNumber: function(d) {
        var val;
        val = 0;
        val += d[0] << 24;
        val += d[1] << 16;
        val += d[2] << 8;
        return val += d[3];
      },
      fromNumber: function(n) {
        throw new Error("not implemented");
      }
    },
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
    }
  };

}).call(this);
