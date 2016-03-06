
/**
kDDesktopControl

Desktop > Newton
ULong 'dsnc'
ULong length = 0

To indicate that the desktop is in control, each of the following commands 
should be preceded by a kDDesktopControl command, to which the Newton does 
not reply. Control is relinquished when the desktop sends a kDOperationDone 
command.
 */

(function() {
  var EventCommand, kDDesktopControl,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  module.exports = kDDesktopControl = (function(superClass) {
    extend(kDDesktopControl, superClass);

    kDDesktopControl.id = 'dsnc';

    kDDesktopControl.prototype.id = kDDesktopControl.id;

    kDDesktopControl.prototype.name = 'kDDesktopControl';

    kDDesktopControl.prototype.length = 0;

    function kDDesktopControl() {
      kDDesktopControl.__super__.constructor.apply(this, arguments);
    }

    return kDDesktopControl;

  })(EventCommand);

}).call(this);
