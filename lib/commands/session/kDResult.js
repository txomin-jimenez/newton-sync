
/**
kDResult

Desktop <> Newton

ULong 'rtdk'
ULong length = 4
SLong error code

This command is sent by either Newton or PC in response to any of the commands 
that don't request data. It lets the requester know that things are still 
proceeding OK.
 */

(function() {
  var EventCommand, kDResult,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  module.exports = kDResult = (function(superClass) {
    extend(kDResult, superClass);

    kDResult.id = 'dres';

    kDResult.prototype.id = kDResult.id;

    kDResult.prototype.name = 'kDResult';

    kDResult.prototype.length = 4;

    function kDResult() {
      kDResult.__super__.constructor.apply(this, arguments);
    }

    kDResult.prototype.dataToBinary = function() {
      var data;
      data = new Buffer(8);
      data.writeUInt32BE(this.length, 0);
      data.writeUInt32BE(this.data, 4);
      return data;
    };

    kDResult.prototype.dataFromBinary = function(dataBuffer) {
      this.length = dataBuffer.readUInt32BE(0);
      return this.data = {
        errorCode: dataBuffer.readInt32BE(4)
      };
    };

    return kDResult;

  })(EventCommand);

}).call(this);
