
/**
kDSynchronize

Desktop < Newton
ULong 'sync'
ULong length = 0

This command is sent to the desktop when the user taps the Synchronize button on
the Newton. The user wishes to synchronize Newton data with desktop applications
 */

(function() {
  var EventCommand, kDSynchronize,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  module.exports = kDSynchronize = (function(superClass) {
    extend(kDSynchronize, superClass);

    kDSynchronize.id = 'sync';

    kDSynchronize.prototype.id = kDSynchronize.id;

    kDSynchronize.prototype.name = 'kDSynchronize';

    kDSynchronize.prototype.length = 0;

    function kDSynchronize() {
      kDSynchronize.__super__.constructor.apply(this, arguments);
    }

    return kDSynchronize;

  })(EventCommand);

}).call(this);
