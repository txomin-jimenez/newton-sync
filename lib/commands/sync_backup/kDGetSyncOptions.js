
/**
kDGetSyncOptions

Desktop > Newton
ULong 'gsyn'
ULong length = 0

This command is sent when the desktop wants to get the selective sync or
selective restore info from the Newton.
 */

(function() {
  var EventCommand, kDGetSyncOptions,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  module.exports = kDGetSyncOptions = (function(superClass) {
    extend(kDGetSyncOptions, superClass);

    kDGetSyncOptions.id = 'gsyn';

    kDGetSyncOptions.prototype.id = kDGetSyncOptions.id;

    kDGetSyncOptions.prototype.name = 'kDGetSyncOptions';

    kDGetSyncOptions.prototype.length = 0;

    function kDGetSyncOptions() {
      kDGetSyncOptions.__super__.constructor.apply(this, arguments);
    }

    return kDGetSyncOptions;

  })(EventCommand);

}).call(this);
