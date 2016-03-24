
/**
kDBackupSoupDone

Desktop < Newton

ULong 'bsdn'
ULong length = 0

This command terminates the sequence of commands sent in response to a 
kDBackupSoup command.
 */

(function() {
  var EventCommand, kDBackupSoupDone,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  module.exports = kDBackupSoupDone = (function(superClass) {
    extend(kDBackupSoupDone, superClass);

    kDBackupSoupDone.id = 'bsdn';

    kDBackupSoupDone.prototype.id = kDBackupSoupDone.id;

    kDBackupSoupDone.prototype.name = 'kDBackupSoupDone';

    kDBackupSoupDone.prototype.length = 0;

    function kDBackupSoupDone() {
      kDBackupSoupDone.__super__.constructor.apply(this, arguments);
    }

    return kDBackupSoupDone;

  })(EventCommand);

}).call(this);
