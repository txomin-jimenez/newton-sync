
/**
kDSetTimeout

Desktop > Newton

ULong 'wicn'
ULong length = 4
ULong timeout in seconds

This command sets the timeout for the connection (the time the Newton will wait
to receive data before it disconnects). This time is typically set to 30 seconds
 */

(function() {
  var EventCommand, kDSetTimeout,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  module.exports = kDSetTimeout = (function(superClass) {
    extend(kDSetTimeout, superClass);

    kDSetTimeout.id = 'stim';

    kDSetTimeout.prototype.id = kDSetTimeout.id;

    kDSetTimeout.prototype.name = 'kDSetTimeout';

    kDSetTimeout.prototype.length = 4;

    function kDSetTimeout() {
      kDSetTimeout.__super__.constructor.apply(this, arguments);
    }

    kDSetTimeout.prototype.dataToBinary = function() {
      var data;
      data = new Buffer(8);
      data.writeUInt32BE(this.length, 0);
      data.writeUInt32BE(this.data, 4);
      return data;
    };

    return kDSetTimeout;

  })(EventCommand);

}).call(this);
