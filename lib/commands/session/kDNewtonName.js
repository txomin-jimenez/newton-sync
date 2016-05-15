
/**
kDRequestToDock

Desktop < Newton

ULong   'rtdk'
ULong   length
struct  NewtonInfo
UniChar name[]

The Newton's name can be used to locate the proper synchronize file. The
version info includes things like machine type (e.g. J1), ROM version, etc;
 */

(function() {
  var EventCommand, Utils, kDNewtonName,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventCommand = require('../event-command');

  Utils = require('../../utils');

  module.exports = kDNewtonName = (function(superClass) {
    extend(kDNewtonName, superClass);

    kDNewtonName.id = 'name';

    kDNewtonName.prototype.id = kDNewtonName.id;

    kDNewtonName.prototype.name = 'kDNewtonName';

    function kDNewtonName() {
      kDNewtonName.__super__.constructor.apply(this, arguments);
    }

    kDNewtonName.prototype.dataFromBinary = function(dataBuffer) {
      this.length = dataBuffer.readUInt32BE(0);
      console.log("newton name length: " + this.length);
      return this.data = {
        fNewtonID: dataBuffer.readUInt32BE(4),
        fManufacturer: dataBuffer.readUInt32BE(8),
        fMachineType: dataBuffer.readUInt32BE(12),
        fROMVersion: dataBuffer.readUInt32BE(16),
        fROMStage: dataBuffer.readUInt32BE(20),
        fuuu: dataBuffer.readUInt32BE(24),
        fRAMSize: dataBuffer.readUInt32BE(28),
        fScreenHeight: dataBuffer.readUInt32BE(32),
        fScreenWidth: dataBuffer.readUInt32BE(36),
        fPatchVersion: dataBuffer.readUInt32BE(40),
        fNOSVersion: dataBuffer.readUInt32BE(44),
        fInternalStorageSig: dataBuffer.readUInt32BE(48),
        fScreenResolutionV: dataBuffer.readUInt32BE(52),
        fScreenResolutionH: dataBuffer.readUInt32BE(56),
        fScreenDepth: dataBuffer.readUInt32BE(60),
        fSystemFlags: dataBuffer.readUInt32BE(64),
        fSerialNumber: [dataBuffer.readUInt32BE(68), dataBuffer.readUInt32BE(72)],
        fTargetProtocol: dataBuffer.readUInt32BE(76),
        name: Utils.unichar.toString(dataBuffer.slice(80))
      };
    };

    return kDNewtonName;

  })(EventCommand);

}).call(this);
