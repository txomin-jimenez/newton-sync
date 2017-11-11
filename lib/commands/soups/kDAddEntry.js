
/**
kDAddEntry

Desktop > Newton

ULong 'adde'
ULong length
NSOF  entry frame

This command is sent when the PC wants to add an entry to the current soup.
 */

(function() {
  var EventCommand, NsOF, kDAddEntry,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  NsOF = require('../../nsof');

  module.exports = kDAddEntry = (function(superClass) {
    extend(kDAddEntry, superClass);

    kDAddEntry.id = 'adde';

    kDAddEntry.prototype.id = kDAddEntry.id;

    kDAddEntry.prototype.name = 'kDAddEntry';

    kDAddEntry.prototype.length = null;

    function kDAddEntry() {
      kDAddEntry.__super__.constructor.apply(this, arguments);
    }

    kDAddEntry.prototype.dataToBinary = function() {
      var frameData, lengthBuff;
      frameData = NsOF.encode(this.data);
      lengthBuff = new Buffer(4);
      lengthBuff.writeUInt32BE(frameData.length, 0);
      return Buffer.concat([lengthBuff, frameData]);
    };

    return kDAddEntry;

  })(EventCommand);

}).call(this);

//# sourceMappingURL=kDAddEntry.js.map
