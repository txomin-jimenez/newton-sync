
/**
kDSyncResults

Desktop > Newton

ULong 'sres'
ULong length
NSOF  sync results

This command can optionally be sent at the end of synchronization. If it is
sent, the results are displayed on the Newton. The array looks like this:

  [["store name", restored, "soup name", count, "soup name" count],
     ["store name", restored, ...]]

restored is true if the desktop detected that the Newton had been restore to
since the last sync.

count is the number of conflicting entries that were found for each soup. Soups
are only in the list if they had a conflict. When a conflict is detected, the
Newton version is saved and the desktop version is moved to the archive file.
 */

(function() {
  var EventCommand, NsOF, kDSyncResults,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  NsOF = require('../../nsof');

  module.exports = kDSyncResults = (function(superClass) {
    extend(kDSyncResults, superClass);

    kDSyncResults.id = 'sres';

    kDSyncResults.prototype.id = kDSyncResults.id;

    kDSyncResults.prototype.name = 'kDSyncResults';

    kDSyncResults.prototype.length = 0;

    function kDSyncResults() {
      kDSyncResults.__super__.constructor.apply(this, arguments);
    }

    kDSyncResults.prototype.dataToBinary = function() {
      var frameData, lengthBuff;
      frameData = NsOF.encode(this.data);
      lengthBuff = new Buffer(4);
      lengthBuff.writeUInt32BE(frameData.length, 0);
      return Buffer.concat([lengthBuff, frameData]);
    };

    return kDSyncResults;

  })(EventCommand);

}).call(this);

//# sourceMappingURL=kDSyncResults.js.map
