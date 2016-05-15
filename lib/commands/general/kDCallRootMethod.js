
/**
kDCallRootMethod

Desktop > Newton

ULong 'crmf'
ULong length
NSOF method name symbol
NSOF method args array

This command asks the Newton to call the specified root method. The return
value from the method is sent to the desktop with a kDCallResult command.
 */

(function() {
  var EventCommand, NSymbol, NsOF, kDCallRootMethod,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  NsOF = require('../../nsof');

  NSymbol = require('../../nsof/nsymbol');

  module.exports = kDCallRootMethod = (function(superClass) {
    extend(kDCallRootMethod, superClass);

    kDCallRootMethod.id = 'crmf';

    kDCallRootMethod.prototype.id = kDCallRootMethod.id;

    kDCallRootMethod.prototype.name = 'kDCallRootMethod';

    kDCallRootMethod.prototype.length = null;

    function kDCallRootMethod() {
      kDCallRootMethod.__super__.constructor.apply(this, arguments);
    }

    kDCallRootMethod.prototype.dataToBinary = function() {
      var functionArgs, functionSymbol, lengthBuff, res;
      functionSymbol = NsOF.encode(NSymbol.encode(this.data.functionName));
      functionArgs = NsOF.encode(this.data.functionArgs);
      lengthBuff = new Buffer('ffffffff', 'hex');
      res = Buffer.concat([lengthBuff, functionSymbol, functionArgs]);
      return res;
    };

    return kDCallRootMethod;

  })(EventCommand);

}).call(this);
