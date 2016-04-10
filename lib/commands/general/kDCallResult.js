
/**
kDCallResult

Desktop < Newton

ULong 'cres'
ULong length
NSOF  result ref

This command is sent in response to a kDCallGlobalFunction or kDCallRootMethod 
command. The ref is the return value from the function or method called.
 */

(function() {
  var EventCommand, NsOF, kDCallResult,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  NsOF = require('../../nsof');

  module.exports = kDCallResult = (function(superClass) {
    extend(kDCallResult, superClass);

    kDCallResult.id = 'cres';

    kDCallResult.prototype.id = kDCallResult.id;

    kDCallResult.prototype.name = 'kDCallResult';

    kDCallResult.prototype.length = null;

    function kDCallResult() {
      kDCallResult.__super__.constructor.apply(this, arguments);
    }

    kDCallResult.prototype.dataFromBinary = function(dataBuffer) {
      this.length = dataBuffer.readUInt32BE(0);
      return this.data = NsOF.decode(dataBuffer.slice(4));
    };

    return kDCallResult;

  })(EventCommand);

}).call(this);
