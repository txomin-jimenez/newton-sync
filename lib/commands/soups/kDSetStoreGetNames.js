
/**
kDSetStoreGetNames

Desktop > Newton

ULong 'ssgn'
ULong length
NSOF  store frame

This command is the same as kDSetCurrentStore except that it returns the names
of the soups on the stores as if you'd send a kDGetSoupNames command. It sets
the current store on the Newton. A store frame is sent to uniquely identify the
store to be set:
  
{ name: "Gilligan’s Island",
  kind: "Flash storage card",
  signature: 734830,
  info: {store-info-frame} // this one is optional
 }

A kDSoupNames is sent by the Newton in response.
 */

(function() {
  var EventCommand, NsOF, kDSetStoreGetNames,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  NsOF = require('../../nsof');

  module.exports = kDSetStoreGetNames = (function(superClass) {
    extend(kDSetStoreGetNames, superClass);

    kDSetStoreGetNames.id = 'ssgn';

    kDSetStoreGetNames.prototype.id = kDSetStoreGetNames.id;

    kDSetStoreGetNames.prototype.name = 'kDSetStoreGetNames';

    kDSetStoreGetNames.prototype.length = null;

    function kDSetStoreGetNames() {
      kDSetStoreGetNames.__super__.constructor.apply(this, arguments);
    }

    kDSetStoreGetNames.prototype.dataToBinary = function() {
      var frameData, lengthBuff;
      frameData = NsOF.encode(this.data);
      lengthBuff = new Buffer(4);
      lengthBuff.writeUInt32BE(frameData.length, 0);
      return Buffer.concat([lengthBuff, frameData]);
    };

    return kDSetStoreGetNames;

  })(EventCommand);

}).call(this);
