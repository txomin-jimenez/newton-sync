
/**
kDDeleteEntries

Desktop > Newton

ULong 'dele'
ULong length
ULong count of ids int the array
ULong [ids]

This command is sent to delete one or more entries from the current soup.
 */

(function() {
  var EventCommand, Utils, _, kDDeleteEntries,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require('lodash');

  EventCommand = require('../event-command');

  Utils = require('../../utils');

  module.exports = kDDeleteEntries = (function(superClass) {
    extend(kDDeleteEntries, superClass);

    kDDeleteEntries.id = 'dele';

    kDDeleteEntries.prototype.id = kDDeleteEntries.id;

    kDDeleteEntries.prototype.name = 'kDDeleteEntries';

    kDDeleteEntries.prototype.length = null;

    function kDDeleteEntries() {
      kDDeleteEntries.__super__.constructor.apply(this, arguments);
    }

    kDDeleteEntries.prototype.dataToBinary = function() {
      var commandSize, dataBuff;
      commandSize = 4 + (this.data.length * 4);
      dataBuff = new Buffer(4 + commandSize);
      dataBuff.writeUInt32BE(commandSize, 0);
      dataBuff.writeUInt32BE(this.data.length, 4);
      _.forEach(this.data, function(value, key) {
        return dataBuff.writeUInt32BE(value, 8 + (key * 4));
      });
      return dataBuff;
    };

    return kDDeleteEntries;

  })(EventCommand);

}).call(this);

//# sourceMappingURL=kDDeleteEntries.js.map
