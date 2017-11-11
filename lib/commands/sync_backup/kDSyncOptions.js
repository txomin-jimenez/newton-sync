
/**
kDSyncOptions

Desktop < Newton

ULong   'sopt'
ULong   length
NSOF    info frame

This command is sent whenever the user on the Newton has selected selective
sync. The frame sent completely specifies which information is to be
synchronized.

  { packages: TRUEREF,
    syncAll: TRUEREF,
    stores: [{store-info}, {store-info}] }
    
Each store frame in the stores array contains the same information returned by
the kDStoreNames command with the addition of soup information. It looks like
this:

  { name: "Treasure Island",
    signature: 159604293,
    totalsize: 15982592,
    usedsize: 3346692,
    kind: "Flash storage card",
    soups: [“Names”,”Notes”,...],
    signatures: [411528, 843359,...],
    info: {store-info-frame}
  }
    
If the user has specified to sync all information the frame will look the same
except there won't be a soups slot--all soups are assumed.

Note that the user can specify which stores to sync while specifying that all
soups should be synced.

If the user specifies that packages should be synced the packages flag will be
true and the packages soup will be specified in the store frame(s).
 */

(function() {
  var EventCommand, Utils, kDSyncOptions,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  Utils = require('../../utils');

  module.exports = kDSyncOptions = (function(superClass) {
    extend(kDSyncOptions, superClass);

    kDSyncOptions.id = 'sopt';

    kDSyncOptions.prototype.id = kDSyncOptions.id;

    kDSyncOptions.prototype.name = 'kDSyncOptions';

    kDSyncOptions.prototype.length = null;

    function kDSyncOptions() {
      kDSyncOptions.__super__.constructor.apply(this, arguments);
    }

    kDSyncOptions.prototype.dataFromBinary = function(dataBuffer) {
      this.length = dataBuffer.readUInt32BE(0);
      return this.data = this.dataBuffer;
    };

    return kDSyncOptions;

  })(EventCommand);

}).call(this);

//# sourceMappingURL=kDSyncOptions.js.map
