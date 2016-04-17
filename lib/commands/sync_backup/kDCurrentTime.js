
/**
kDCurrentTime

Desktop < Newton

ULong 'time'
 */

(function() {
  var EventCommand, Utils, kDCurrentTime, moment,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  moment = require('moment');

  EventCommand = require('../event-command');

  Utils = require('../../utils');

  module.exports = kDCurrentTime = (function(superClass) {
    extend(kDCurrentTime, superClass);

    kDCurrentTime.id = 'time';

    kDCurrentTime.prototype.id = kDCurrentTime.id;

    kDCurrentTime.prototype.name = 'kDCurrentTime';

    kDCurrentTime.prototype.length = null;

    function kDCurrentTime() {
      kDCurrentTime.__super__.constructor.apply(this, arguments);
    }

    kDCurrentTime.prototype.dataFromBinary = function(dataBuffer) {
      var minutesSince1904;
      this.length = dataBuffer.readUInt32BE(0);
      minutesSince1904 = dataBuffer.readUInt32BE(4);
      return this.data = Utils.newtonTime.toJSON(minutesSince1904);
    };

    return kDCurrentTime;

  })(EventCommand);

}).call(this);
