
/**
kDRequestToSync

Desktop > Newton
ULong 'ssyn'
ULong length = 0

This command is sent when the desktop wants to start a sync operation, when
both the Newton and the desktop were waiting for the user to specify an
operation
 */

(function() {
  var EventCommand, kDRequestToSync,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  module.exports = kDRequestToSync = (function(superClass) {
    extend(kDRequestToSync, superClass);

    kDRequestToSync.id = 'ssyn';

    kDRequestToSync.prototype.id = kDRequestToSync.id;

    kDRequestToSync.prototype.name = 'kDRequestToSync';

    kDRequestToSync.prototype.length = 0;

    function kDRequestToSync() {
      kDRequestToSync.__super__.constructor.apply(this, arguments);
    }

    return kDRequestToSync;

  })(EventCommand);

}).call(this);

//# sourceMappingURL=kDRequestToSync.js.map
