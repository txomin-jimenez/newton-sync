
/**
kDSoupInfo

Desktop < Newton

ULong 'sinf'
ULong length
NSOF  soup info frame

This command is used to send a soup info frame. When received the info for the
current soup is set to the specified frame.
 */

(function() {
  var EventCommand, NsOF, kDSoupInfo,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  NsOF = require('../../nsof');

  module.exports = kDSoupInfo = (function(superClass) {
    extend(kDSoupInfo, superClass);

    kDSoupInfo.id = 'sinf';

    kDSoupInfo.prototype.id = kDSoupInfo.id;

    kDSoupInfo.prototype.name = 'kDSoupInfo';

    kDSoupInfo.prototype.length = null;

    function kDSoupInfo() {
      kDSoupInfo.__super__.constructor.apply(this, arguments);
    }

    kDSoupInfo.prototype.dataFromBinary = function(dataBuffer) {
      this.length = dataBuffer.readUInt32BE(0);
      return this.data = NsOF.decode(dataBuffer.slice(4));
    };

    return kDSoupInfo;

  })(EventCommand);

}).call(this);

//# sourceMappingURL=kDSoupInfo.js.map
