
/**
kDStoreNames

Desktop < Newton

ULong 'stor'

This command is sent in response to a kDGetStoreNames command. It returns 
information about all the stores on the Newton. Each array slot contains the 
following information about a store:

{Name: "",
  signature: 1234,
  totalsize: 1234,
  usedsize: 1234,
  kind: "",
  info: {store info frame},
  readOnly: true,
  defaultStore: true,     // only for the defaultstore
  storePassword: password  // only if a store password has been set
}
 */

(function() {
  var EventCommand, kDStoreNames,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  module.exports = kDStoreNames = (function(superClass) {
    extend(kDStoreNames, superClass);

    kDStoreNames.id = 'stor';

    kDStoreNames.prototype.id = kDStoreNames.id;

    kDStoreNames.prototype.name = 'kDStoreNames';

    kDStoreNames.prototype.length = null;

    function kDStoreNames() {
      kDStoreNames.__super__.constructor.apply(this, arguments);
    }

    kDStoreNames.prototype.dataFromBinary = function(dataBuffer) {
      this.length = dataBuffer.readUInt32BE(0);
      return this.data = dataBuffer;
    };

    return kDStoreNames;

  })(EventCommand);

}).call(this);
