
/**
kDSetSoupGetInfo

Desktop > Newton

ULong 'ssgi
ULong length
soup name   // C string

This command is like a combination of kDSetCurrentSoup and kDGetChangedInfo. It
sets the current soup--see kDSetCurrentSoup for details. A kDSoupInfo or kDRes
command is sent by the newton in response.
 */

(function() {
  var EventCommand, NsOF, Utils, kDSetSoupGetInfo,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  NsOF = require('../../nsof');

  Utils = require('../../utils');

  module.exports = kDSetSoupGetInfo = (function(superClass) {
    extend(kDSetSoupGetInfo, superClass);

    kDSetSoupGetInfo.id = 'ssgi';

    kDSetSoupGetInfo.prototype.id = kDSetSoupGetInfo.id;

    kDSetSoupGetInfo.prototype.name = 'kDSetSoupGetInfo';

    kDSetSoupGetInfo.prototype.length = null;

    function kDSetSoupGetInfo() {
      kDSetSoupGetInfo.__super__.constructor.apply(this, arguments);
    }

    kDSetSoupGetInfo.prototype.dataToBinary = function() {
      var frameData, lengthBuff;
      frameData = Utils.unichar.toUniCharBuffer(this.data);
      lengthBuff = new Buffer(4);
      lengthBuff.writeUInt32BE(frameData.length, 0);
      return Buffer.concat([lengthBuff, frameData]);
    };

    return kDSetSoupGetInfo;

  })(EventCommand);

}).call(this);
