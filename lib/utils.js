(function() {
  module.exports = {
    protocol: {
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
    }
  };

}).call(this);
