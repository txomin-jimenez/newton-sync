
/**
kDNewtonInfo

Desktop < Newton

ULong   'ninf'
ULong   length=12
ULong   protocol version 
ULong   encrypted key 1 
ULong   encrypted key 2

This command is used to negotiate the real protocol version. See kDDesktopInfo 
for more info. The password key is used as part of password verification.
 */

(function() {
  var EventCommand, Utils, kDNewtonInfo,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  Utils = require('../../utils');

  module.exports = kDNewtonInfo = (function(superClass) {
    extend(kDNewtonInfo, superClass);

    kDNewtonInfo.id = 'ninf';

    kDNewtonInfo.prototype.id = kDNewtonInfo.id;

    kDNewtonInfo.prototype.name = 'kDNewtonInfo';

    function kDNewtonInfo() {
      kDNewtonInfo.__super__.constructor.apply(this, arguments);
    }

    kDNewtonInfo.prototype.dataFromBinary = function(dataBuffer) {
      this.length = dataBuffer.readUInt32BE(0);
      return this.data = {
        protocolVersion: dataBuffer.readUInt32BE(4),
        encryptedKey1: dataBuffer.readUInt32BE(8),
        encryptedKey2: dataBuffer.readUInt32BE(12)
      };
    };

    return kDNewtonInfo;

  })(EventCommand);

}).call(this);
