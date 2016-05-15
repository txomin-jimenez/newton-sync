
/**
kDDisconnect

Desktop <> Newton

ULong 'disc'
ULong length=0

This command is sent by either desktop or Newton when the docking operation
is complete.
 */

(function() {
  var EventCommand, kDDisconnect,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  module.exports = kDDisconnect = (function(superClass) {
    extend(kDDisconnect, superClass);

    kDDisconnect.id = 'disc';

    kDDisconnect.prototype.id = kDDisconnect.id;

    kDDisconnect.prototype.name = 'kDDisconnect';

    kDDisconnect.prototype.length = 0;

    function kDDisconnect() {
      kDDisconnect.__super__.constructor.apply(this, arguments);
    }

    kDDisconnect.prototype.dataFromBinary = function(dataBuffer) {
      return null;
    };

    return kDDisconnect;

  })(EventCommand);

}).call(this);
