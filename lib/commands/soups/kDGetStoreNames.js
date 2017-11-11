
/**
kDGetStoreNames

Desktop > Newton
ULong 'gsto'
ULong length = 0

Request store information to Newton device
 */

(function() {
  var EventCommand, Utils, kDGetStoreNames,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  Utils = require('../../utils');

  module.exports = kDGetStoreNames = (function(superClass) {
    extend(kDGetStoreNames, superClass);

    kDGetStoreNames.id = 'gsto';

    kDGetStoreNames.prototype.id = kDGetStoreNames.id;

    kDGetStoreNames.prototype.name = 'kDGetStoreNames';

    kDGetStoreNames.prototype.length = null;

    function kDGetStoreNames() {
      kDGetStoreNames.__super__.constructor.apply(this, arguments);
    }

    return kDGetStoreNames;

  })(EventCommand);

}).call(this);

//# sourceMappingURL=kDGetStoreNames.js.map
