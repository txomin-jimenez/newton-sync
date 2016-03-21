
/**
kDSoupIDs

Desktop < Newton

ULong 'sids'

This command is sent in response to a kDGetSoupIDs command. It returns all 
the IDs from the current soup.
 */

(function() {
  var EventCommand, NsOF, kDSoupIDs,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  NsOF = require('../../nsof');

  module.exports = kDSoupIDs = (function(superClass) {
    extend(kDSoupIDs, superClass);

    kDSoupIDs.id = 'sids';

    kDSoupIDs.prototype.id = kDSoupIDs.id;

    kDSoupIDs.prototype.name = 'kDSoupIDs';

    kDSoupIDs.prototype.length = null;

    function kDSoupIDs() {
      kDSoupIDs.__super__.constructor.apply(this, arguments);
    }

    kDSoupIDs.prototype.dataFromBinary = function(dataBuffer) {
      this.length = dataBuffer.readUInt32BE(0);
      return this.data = {
        count: dataBuffer.readUInt32BE(4),
        ids: NsOF.decode(dataBuffer.slice(8))
      };
    };

    return kDSoupIDs;

  })(EventCommand);

}).call(this);
