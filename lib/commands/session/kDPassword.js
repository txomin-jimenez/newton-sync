
/**
kDPassword

Desktop <> Newton

ULong   'pass'
ULong   length=8
ULong   encrypted key 1 
ULong   encrypted key 2

When sent by the Newton, this command returns the key received in the 
kDDesktopInfomessage encrypted using the password.
When sent by the desktop, this command returns the key received in the 
kDNewtonInfomessage encrypted using the password.
 */

(function() {
  var EventCommand, Utils, kDPassword,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  Utils = require('../../utils');

  module.exports = kDPassword = (function(superClass) {
    extend(kDPassword, superClass);

    kDPassword.id = 'pass';

    kDPassword.prototype.id = kDPassword.id;

    kDPassword.prototype.name = 'kDPassword';

    function kDPassword() {
      kDPassword.__super__.constructor.apply(this, arguments);
    }

    kDPassword.prototype.dataFromBinary = function(dataBuffer) {
      this.length = dataBuffer.readUInt32BE(0);
      return this.data = {
        encryptedKey1: dataBuffer.readUInt32BE(4),
        encryptedKey2: dataBuffer.readUInt32BE(8)
      };
    };

    return kDPassword;

  })(EventCommand);

}).call(this);
