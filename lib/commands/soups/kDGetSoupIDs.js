
/**
kDGetSoupIDs

Desktop > Newton

ULong 'gids'

This command is sent to request a list of entry IDs for the current soup. 
It expects to receive a kDSoupIDs command in response.
 */

(function() {
  var EventCommand, kDGetSoupIDs,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  module.exports = kDGetSoupIDs = (function(superClass) {
    extend(kDGetSoupIDs, superClass);

    kDGetSoupIDs.id = 'gids';

    kDGetSoupIDs.prototype.id = kDGetSoupIDs.id;

    kDGetSoupIDs.prototype.name = 'kDGetSoupIDs';

    kDGetSoupIDs.prototype.length = null;

    function kDGetSoupIDs() {
      kDGetSoupIDs.__super__.constructor.apply(this, arguments);
    }

    return kDGetSoupIDs;

  })(EventCommand);

}).call(this);
