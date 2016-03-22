
/**
kDSoupIDs

Desktop < Newton

ULong 'sids'

This command is sent in response to a kDGetSoupIDs command. It returns all 
the IDs from the current soup.
 */

(function() {
  var EventCommand, _, kDSoupIDs,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  _ = require('lodash');

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
      var count_, data_;
      console.log(dataBuffer.toString('hex'));
      this.length = dataBuffer.readUInt32BE(0);
      count_ = dataBuffer.readUInt32BE(4);
      if (count_ > 0) {
        data_ = new Array(count_);
        _.forEach(data_, function(value, key) {
          var value_;
          value_ = dataBuffer.readUInt32BE(8 + (key * 4));
          return data_[key] = value_;
        });
      } else {
        data_ = null;
      }
      return this.data = {
        count: count_,
        ids: data_
      };
    };

    return kDSoupIDs;

  })(EventCommand);

}).call(this);
