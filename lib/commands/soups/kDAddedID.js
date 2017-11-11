
/**
kDAddedID

Desktop < Newton

ULong 'adid'
ULong length
ULong ID

This command is sent in response to a kDAddEntry command from the PC. It
returns the ID that the entry was given when it was added to the current soup.
 */

(function() {
  var EventCommand, NsOF, kDAddedID,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  NsOF = require('../../nsof');

  module.exports = kDAddedID = (function(superClass) {
    extend(kDAddedID, superClass);

    kDAddedID.id = 'adid';

    kDAddedID.prototype.id = kDAddedID.id;

    kDAddedID.prototype.name = 'kDAddedID';

    kDAddedID.prototype.length = null;

    function kDAddedID() {
      kDAddedID.__super__.constructor.apply(this, arguments);
    }

    kDAddedID.prototype.dataFromBinary = function(dataBuffer) {
      this.length = dataBuffer.readUInt32BE(0);
      return this.data = dataBuffer.readUInt32BE(4);
    };

    return kDAddedID;

  })(EventCommand);

}).call(this);

//# sourceMappingURL=kDAddedID.js.map
