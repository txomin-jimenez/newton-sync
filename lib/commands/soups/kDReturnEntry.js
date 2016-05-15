
/**
kDReturnEntry

Desktop > Newton

ULong 'rete'
ULong length = 4
ULong id // ID of the entry to return

This command is sent when the PC wants to retrieve a changed entry from the
current soup.
 */

(function() {
  var EventCommand, kDReturnEntry,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  module.exports = kDReturnEntry = (function(superClass) {
    extend(kDReturnEntry, superClass);

    kDReturnEntry.id = 'rete';

    kDReturnEntry.prototype.id = kDReturnEntry.id;

    kDReturnEntry.prototype.name = 'kDReturnEntry';

    kDReturnEntry.prototype.length = 4;

    function kDReturnEntry() {
      kDReturnEntry.__super__.constructor.apply(this, arguments);
    }

    kDReturnEntry.prototype.dataToBinary = function() {
      var data;
      data = new Buffer(8);
      data.writeUInt32BE(this.length, 0);
      data.writeUInt32BE(this.data, 4);
      return data;
    };

    return kDReturnEntry;

  })(EventCommand);

}).call(this);
