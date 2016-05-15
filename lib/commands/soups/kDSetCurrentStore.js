
/**
kDSetCurrentStore

Desktop > Newton

ULong 'ssto'
ULong length
NSOF  store frame

This command sets the current store on the Newton. A store frame is sent to
uniquely identify the store to be set:

{ name: "Gilligan’s Island",
  kind: "Flash storage card",
  signature: 734830,
  info: {store-info-frame} // this one is optional
 }
 */

(function() {
  var EventCommand, NsOF, kDSetCurrentStore,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  NsOF = require('../../nsof');

  module.exports = kDSetCurrentStore = (function(superClass) {
    extend(kDSetCurrentStore, superClass);

    kDSetCurrentStore.id = 'ssto';

    kDSetCurrentStore.prototype.id = kDSetCurrentStore.id;

    kDSetCurrentStore.prototype.name = 'kDSetCurrentStore';

    kDSetCurrentStore.prototype.length = null;

    function kDSetCurrentStore() {
      kDSetCurrentStore.__super__.constructor.apply(this, arguments);
    }

    kDSetCurrentStore.prototype.dataToBinary = function() {
      var frameData, lengthBuff;
      frameData = NsOF.encode(this.data);
      lengthBuff = new Buffer(4);
      lengthBuff.writeUInt32BE(frameData.length, 0);
      return Buffer.concat([lengthBuff, frameData]);
    };

    return kDSetCurrentStore;

  })(EventCommand);

}).call(this);
