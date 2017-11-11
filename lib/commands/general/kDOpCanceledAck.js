
/**
kDOpCanceledAck

Desktop <> Newton

uLong 'ocaa'
ULong length = 0

This command is sent in response to a kDOperationCanceled.
 */

(function() {
  var EventCommand, kDOpCanceledAck,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  module.exports = kDOpCanceledAck = (function(superClass) {
    extend(kDOpCanceledAck, superClass);

    kDOpCanceledAck.id = 'ocaa';

    kDOpCanceledAck.prototype.id = kDOpCanceledAck.id;

    kDOpCanceledAck.prototype.name = 'kDOpCanceledAck';

    kDOpCanceledAck.prototype.length = 0;

    function kDOpCanceledAck() {
      kDOpCanceledAck.__super__.constructor.apply(this, arguments);
    }

    return kDOpCanceledAck;

  })(EventCommand);

}).call(this);

//# sourceMappingURL=kDOpCanceledAck.js.map
