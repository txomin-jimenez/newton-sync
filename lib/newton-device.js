
/**
  Handle all Newton Device information related command and process.
@class NewtonDevice
 */

(function() {
  var CommandBroker, NewtonDevice, StateMachine, Utils, _;

  _ = require('lodash');

  CommandBroker = require('./commands/command-broker');

  StateMachine = require('./commands/state-machine');

  Utils = require('./utils');

  module.exports = NewtonDevice = (function() {

    /**
    @property name
     */
    NewtonDevice.prototype.name = null;

    NewtonDevice.prototype.fNewtonID = null;

    NewtonDevice.prototype.fManufacturer = null;

    NewtonDevice.prototype.fMachineType = null;

    NewtonDevice.prototype.fROMVersion = null;

    NewtonDevice.prototype.fROMStage = null;

    NewtonDevice.prototype.fRAMSize = null;

    NewtonDevice.prototype.fScreenHeight = null;

    NewtonDevice.prototype.fScreenWidth = null;

    NewtonDevice.prototype.fPatchVersion = null;

    NewtonDevice.prototype.fNOSVersion = null;

    NewtonDevice.prototype.fInternalStoreSig = null;

    NewtonDevice.prototype.fScreenResolutionV = null;

    NewtonDevice.prototype.fScreenResolutionH = null;

    NewtonDevice.prototype.fScreenDepth = null;

    NewtonDevice.prototype.fSystemFlags = null;

    NewtonDevice.prototype.fSerialNumber = null;

    NewtonDevice.prototype.fTargetProtocol = null;


    /**
      TCP socket for device comms
    @property socket
     */

    NewtonDevice.prototype.socket = null;


    /**
    @class NewtonDevice
    @constructor
     */

    function NewtonDevice(options) {
      if (options) {
        _.extend(this, _.pick(options, ['fNewtonID', 'fManufacturer', 'fMachineType', 'fROMVersion', 'fROMStage', 'fRAMSize', 'fScreenWidth', 'fScreenWidth', 'fPatchVersion', 'fNOSVersion', 'fInternalStoreSig', 'fScreenResolutionV', 'fScreenResolutionH', 'fScreenDepth', 'fSystemFlags', 'fSerialNumber', 'fTargetProtocol', 'name']));
      }
    }

    return NewtonDevice;

  })();

}).call(this);
