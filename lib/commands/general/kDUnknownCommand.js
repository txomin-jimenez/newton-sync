
/**
kDUnknownCommand

Desktop <> Newton

uLong 'unkn'
ULong length = 4
ULong bad command

This command is sent when a message is received that is unknown. When the
desktop receives this command it can either install a protocol extension and
try again or return an error to the Newton. If the built-in Newton code
receives this command it always signals an error. The bad command parameter
is the 4 char command that wasn't recognized. The data is not returned.
 */

(function() {
  var EventCommand, kDUnknownCommand,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  module.exports = kDUnknownCommand = (function(superClass) {
    extend(kDUnknownCommand, superClass);

    kDUnknownCommand.id = 'unkn';

    kDUnknownCommand.prototype.id = kDUnknownCommand.id;

    kDUnknownCommand.prototype.name = 'kDUnknownCommand';

    kDUnknownCommand.prototype.length = 4;

    function kDUnknownCommand() {
      kDUnknownCommand.__super__.constructor.apply(this, arguments);
    }

    kDUnknownCommand.prototype.dataToBinary = function() {
      var data;
      data = new Buffer(8);
      data.writeUInt32BE(this.length, 0);
      data.writeString(this.data, 4, 4, 'ascii');
      return data;
    };

    kDUnknownCommand.prototype.dataFromBinary = function(dataBuffer) {
      this.length = dataBuffer.readUInt32BE(0);
      return this.data = {
        unknownCommand: dataBuffer.toString('ascii', 4)
      };
    };

    return kDUnknownCommand;

  })(EventCommand);

}).call(this);

//# sourceMappingURL=kDUnknownCommand.js.map
