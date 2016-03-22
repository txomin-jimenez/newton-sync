
/**
kDOperationDone

Desktop <> Newton

uLong 'opdn'
ULong length = 0

This command is sent when an operation is completed. It't only sent in 
situations where there might be some ambiguity. Currently, there are two 
situations where this is sent. When the desktop finishes a restore it sends 
this command. When a sync is finished and there are no sync results 
(conflicts) to send to the newton the desktop sends this command.
 */

(function() {
  var EventCommand, kDOperationDone,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  module.exports = kDOperationDone = (function(superClass) {
    extend(kDOperationDone, superClass);

    kDOperationDone.id = 'opdn';

    kDOperationDone.prototype.id = kDOperationDone.id;

    kDOperationDone.prototype.name = 'kDOperationDone';

    kDOperationDone.prototype.length = 0;

    function kDOperationDone() {
      kDOperationDone.__super__.constructor.apply(this, arguments);
    }

    return kDOperationDone;

  })(EventCommand);

}).call(this);
