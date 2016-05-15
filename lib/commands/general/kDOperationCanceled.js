
/**
kDOperationCanceled

Desktop <> Newton

uLong 'opca'
ULong length = 0

This command is sent when the user cancels an operation. The receiver should
return to the "ready" state and acknowledge the cancellation with a
kDOpCanceledAck command..
 */

(function() {
  var EventCommand, kDOperationCanceled,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  module.exports = kDOperationCanceled = (function(superClass) {
    extend(kDOperationCanceled, superClass);

    kDOperationCanceled.id = 'opca';

    kDOperationCanceled.prototype.id = kDOperationCanceled.id;

    kDOperationCanceled.prototype.name = 'kDOperationCanceled';

    kDOperationCanceled.prototype.length = 0;

    function kDOperationCanceled() {
      kDOperationCanceled.__super__.constructor.apply(this, arguments);
    }

    return kDOperationCanceled;

  })(EventCommand);

}).call(this);
