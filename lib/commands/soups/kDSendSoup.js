
/**
kDSendSoup

Desktop > Newton

ULong 'snds'
ULong length = 0

This command requests that all of the entries in a soup be returned to the
desktop. The Newton responds with a series of kDEntry commands for all the
entries in the current soup followed by a kDBackupSoupDone command. All of the
entries are sent without any request from the desktop (in other words, a series
of commands is sent). The process can be interrupted by the desktop by sending
a kDOperationCanceled command. The cancel will be detected between entries. The
kDEntry commands are sent exactly as if they had been requested by a
kDReturnEntry command (they are long padded).
 */

(function() {
  var EventCommand, kDSendSoup,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  module.exports = kDSendSoup = (function(superClass) {
    extend(kDSendSoup, superClass);

    kDSendSoup.id = 'snds';

    kDSendSoup.prototype.id = kDSendSoup.id;

    kDSendSoup.prototype.name = 'kDSendSoup';

    kDSendSoup.prototype.length = 0;

    function kDSendSoup() {
      kDSendSoup.__super__.constructor.apply(this, arguments);
    }

    return kDSendSoup;

  })(EventCommand);

}).call(this);
