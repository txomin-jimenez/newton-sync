
/**
kDCallGlobalFunction

Desktop > Newton

ULong 'cgfn'
ULong length
NSOF function name symbol
NSOF function args array

This command asks the Newton to call the specified function and return its
result. This function must be a global function. The return value from the
function is sent to the desktop with a kDCallResult command.
 */

(function() {
  var EventCommand, NSymbol, NsOF, kDCallGlobalFunction,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  NsOF = require('../../nsof');

  NSymbol = require('../../nsof/nsymbol');

  module.exports = kDCallGlobalFunction = (function(superClass) {
    extend(kDCallGlobalFunction, superClass);

    kDCallGlobalFunction.id = 'cgfn';

    kDCallGlobalFunction.prototype.id = kDCallGlobalFunction.id;

    kDCallGlobalFunction.prototype.name = 'kDCallGlobalFunction';

    kDCallGlobalFunction.prototype.length = null;

    function kDCallGlobalFunction() {
      kDCallGlobalFunction.__super__.constructor.apply(this, arguments);
    }

    kDCallGlobalFunction.prototype.dataToBinary = function() {
      var functionArgs, functionSymbol, lengthBuff, res;
      functionSymbol = NsOF.encode(NSymbol.encode(this.data.functionName));
      functionArgs = NsOF.encode(this.data.functionArgs);
      lengthBuff = new Buffer('ffffffff', 'hex');
      res = Buffer.concat([lengthBuff, functionSymbol, functionArgs]);
      return res;
    };

    return kDCallGlobalFunction;

  })(EventCommand);

}).call(this);
