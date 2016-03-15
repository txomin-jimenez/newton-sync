
/**
kDLastSyncTime

Desktop > Newton
ULong 'stme'
ULong length = 0

this one’s fake (0) just to get the newton time
 */

(function() {
  var EventCommand, Utils, kDLastSyncTime,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  Utils = require('../../utils');

  module.exports = kDLastSyncTime = (function(superClass) {
    extend(kDLastSyncTime, superClass);

    kDLastSyncTime.id = 'stme';

    kDLastSyncTime.prototype.id = kDLastSyncTime.id;

    kDLastSyncTime.prototype.name = 'kDLastSyncTime';

    kDLastSyncTime.prototype.length = 4;

    function kDLastSyncTime() {
      kDLastSyncTime.__super__.constructor.apply(this, arguments);
    }

    kDLastSyncTime.prototype.dataToBinary = function() {
      var data;
      data = new Buffer(8);
      data.writeUInt32BE(this.length, 0);
      data.writeUInt32BE(0, 4);
      return data;
    };

    return kDLastSyncTime;

  })(EventCommand);

}).call(this);
