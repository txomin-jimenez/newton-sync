
/**
kDWhichIcons

Desktop > Newton

ULong 'wicn'
ULong length = 4
ULong icon mask

This command is used to customize the set of icons shown on the Newton. The icon
mask indicates which icons should be shown; see the Icon mask enum in 
DockSession. For example, to show all icons you would use this:
  
kBackupIcon + kSyncIcon + kInstallIcon + kRestoreIcon + kImportIcon + 
kKeyboardIcon
 */

(function() {
  var EventCommand, kDWhichIcons,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  module.exports = kDWhichIcons = (function(superClass) {
    extend(kDWhichIcons, superClass);

    kDWhichIcons.id = 'wicn';

    kDWhichIcons.prototype.id = kDWhichIcons.id;

    kDWhichIcons.prototype.name = 'kDWhichIcons';

    kDWhichIcons.prototype.length = 4;

    function kDWhichIcons() {
      kDWhichIcons.__super__.constructor.apply(this, arguments);
    }

    kDWhichIcons.prototype.dataToBinary = function() {
      var data;
      data = new Buffer(8);
      data.writeUInt32BE(this.length, 0);
      data.writeUInt32BE(this.data, 4);
      return data;
    };

    return kDWhichIcons;

  })(EventCommand);

}).call(this);
