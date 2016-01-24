(function() {
  var EventCommand, kDInitiateDocking,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');


  /**
  kDInitiateDocking
  
  Desktop < Newton
  
  ULong 'dock'
  ULong length = 4
  ULong session type
  
  The session type can be one of {none, settingUp, synchronize, restore, 
  loadPackage, testComm, loadPatch, updatingStores}; see the Session type enum 
  in DockSession. The Newton responds with information about itself.
   */

  EventCommand = require('../event-command');

  module.exports = kDInitiateDocking = (function(superClass) {
    extend(kDInitiateDocking, superClass);

    kDInitiateDocking.id = 'dock';

    kDInitiateDocking.prototype.id = kDInitiateDocking.id;

    kDInitiateDocking.prototype.name = 'kDInitiateDocking';

    kDInitiateDocking.prototype.length = 4;

    function kDInitiateDocking() {
      kDInitiateDocking.__super__.constructor.apply(this, arguments);
    }

    kDInitiateDocking.prototype.dataToBinary = function() {
      var data;
      data = new Buffer(8);
      data.writeUInt32BE(this.length, 0);
      data.writeUInt32BE(this.data.sessionType, 4);
      return data;
    };

    return kDInitiateDocking;

  })(EventCommand);

}).call(this);
