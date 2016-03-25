
/**
kDEntry

Desktop < Newton

ULong 'ntry'
ULong length
NSOF  soup entry
 */

(function() {
  var EventCommand, NsOF, kDEntry,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  NsOF = require('../../nsof');

  module.exports = kDEntry = (function(superClass) {
    extend(kDEntry, superClass);

    kDEntry.id = 'entr';

    kDEntry.prototype.id = kDEntry.id;

    kDEntry.prototype.name = 'kDEntry';

    kDEntry.prototype.length = null;

    function kDEntry() {
      kDEntry.__super__.constructor.apply(this, arguments);
    }

    kDEntry.prototype.dataFromBinary = function(dataBuffer) {
      var err;
      this.length = dataBuffer.readUInt32BE(0);
      try {
        return this.data = NsOF.decode(dataBuffer.slice(4));
      } catch (_error) {
        err = _error;
        console.log("error decoding kDEntry");
        console.log(dataBuffer.slice(4).toString('hex'));
        throw err;
      }
    };

    return kDEntry;

  })(EventCommand);

}).call(this);
