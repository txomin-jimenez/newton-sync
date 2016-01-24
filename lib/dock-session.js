
/**
  Negotiates session with Newton device. Handle connection parameters and
  password exchange with device. Once session initiated successfully it creates
  a NewtonDevice object. NewtonDevice is used to import/export data and so on.
@class DockSession
 */

(function() {
  var CommandBroker, DockSession, Enum, StateMachine, Utils, _;

  _ = require('lodash');

  CommandBroker = require('./commands/command-broker');

  StateMachine = require('./commands/state-machine');

  Utils = require('./utils');

  Enum = Utils.Enum;

  module.exports = DockSession = (function() {
    DockSession.sessionTypes = Enum('kNoSession', 'kSettingUpSession', 'kSynchronizeSession', 'kRestoreSession', 'kLoadPackageSession', 'kTestCommSession', 'kLoadPatchSession', 'kUpdatingStoresSession');


    /**
      TCP socket for device comms
    @property socket
     */

    DockSession.prototype.socket = null;


    /**
      Default timeout in seconds if no comms acivity
    @property kDefaultTimeout
     */

    DockSession.prototype.kDefaultTimeout = 30;


    /**
    @property newtonDevice
     */

    DockSession.prototype.newtonDevice = null;


    /**
    @class DockSession
    @constructor
     */

    function DockSession(options) {
      if (options) {
        _.extend(this, _.pick(options, ['socket', 'newtonDevice']));
      }
      _.extend(this, StateMachine);
      _.extend(this, CommandBroker);
      this._initialize(options);
    }


    /**
      all init method go here
    @method initialize
     */

    DockSession.prototype._initialize = function(options) {
      this.socket.on('end', (function(_this) {
        return function() {
          return _this.endSession();
        };
      })(this));
      return this.initSession();
    };


    /**
      initiates session negotiation with Newton device
        Every session starts like this:
              Desktop                Newton
                              <  kDRequestToDock
          kDInitiateDocking   >
                              <  kDNewtonName 
          kDDesktopInfo       >
                              <  kDNewtonInfo
          kDWhichIcons        >                     optional 
                              <  kDResult
          kDSetTimeout        >                     optional 
                              <  kDPassword
    @method initSession
     */

    DockSession.prototype.initSession = function() {
      this.processBegin();
      return this._initDockSession().then((function(_this) {
        return function() {
          return _this._exchangeDevicesInfo();
        };
      })(this)).then((function(_this) {
        return function() {
          return _this._setDockIcons();
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.sendCommand('kDSetTimeout', _this.kDefaultTimeout);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this._negotiatePassword();
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.processFinish();
        };
      })(this))["catch"]((function(_this) {
        return function(error) {
          return _this.processFinish(error);
        };
      })(this));
    };


    /**
      waits for device request and sends initiate docking as response
    @method initDockSession
     */

    DockSession.prototype._initDockSession = function() {
      return this.receiveCommand('kDRequestToDock').then((function(_this) {
        return function(protocolVersion) {
          var sessionType;
          console.log("...");
          console.log(protocolVersion);
          sessionType = DockSession.sessionTypes.kSynchronizeSession;
          return _this.sendCommand('kDInitiateDocking', {
            sessionType: sessionType
          });
        };
      })(this));
    };


    /**
      send desktop info a save received Newton Device info
    @method exchangeDevicesInfo
     */

    DockSession.prototype._exchangeDevicesInfo = function() {
      return this.receiveCommand('kDNewtonName').then((function(_this) {
        return function(newtonNameInfo) {
          _this.newtonDevice.setInfo(newtonNameInfo);
          return _this.sendCommand('kDDesktopInfo', _this.desktopInfo());
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.receiveCommand('kDNewtonInfo');
        };
      })(this)).then((function(_this) {
        return function(newtonInfo) {};
      })(this));
    };


    /**
      configure which icons will appear in Dock app at Newton device
    @method setDockIcons
     */

    DockSession.prototype._setDockIcons = function() {
      return this.sendCommand('kDWhichIcons', whichIcons).then((function(_this) {
        return function() {
          return _this.receiveCommand('kDResult');
        };
      })(this));
    };


    /**
      process Dock <-> Newton password exchange and check 
    @method negotiatePassword
     */

    DockSession.prototype._negotiatePassword = function() {
      return this.receiveCommand('kDPassword');
    };


    /**
    @method endSession
     */

    DockSession.prototype.endSession = function() {
      return this.dispose();
    };


    /**
    @method dispose
     */

    DockSession.prototype.dispose = function() {
      var i, len, prop, properties, ref, ref1;
      if (this.disposed) {
        return;
      }
      this.emit('dispose', this);
      this.removeAllListeners();
      if ((ref = this.newtonDevice) != null) {
        ref.dispose();
      }
      if ((ref1 = this.socket) != null) {
        ref1.destroy();
      }
      properties = ['socketConnection', 'newtonDevice'];
      for (i = 0, len = properties.length; i < len; i++) {
        prop = properties[i];
        delete this[prop];
      }
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return DockSession;

  })();

}).call(this);
