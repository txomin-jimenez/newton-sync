
/**
  Negotiates session with Newton device. Handles connection parameters and
  password exchange with device. Once session initiated successfully it creates
  a NewtonDevice object. NewtonDevice is used to import/export data and so on.
@class DockSession
 */

(function() {
  var ByteEnum, CommandBroker, DockSession, Enum, NewtonDesCrypto, NewtonDevice, Q, StateMachine, Utils, _;

  _ = require('lodash');

  Q = require('q');

  CommandBroker = require('./commands/command-broker');

  StateMachine = require('./commands/state-machine');

  Utils = require('./utils');

  Enum = Utils.Enum;

  ByteEnum = Utils.ByteEnum;

  NewtonDesCrypto = require('newton-des-crypto');

  NewtonDevice = require('./newton-device');

  module.exports = DockSession = (function() {
    DockSession.sessionTypes = Enum('kNoSession', 'kSettingUpSession', 'kSynchronizeSession', 'kRestoreSession', 'kLoadPackageSession', 'kTestCommSession', 'kLoadPatchSession', 'kUpdatingStoresSession');

    DockSession.dockIcons = ByteEnum('kBackupIcon', 'kRestoreIcon', 'kInstallIcon', 'kImportIcon', 'kSyncIcon', 'kKeyboardIcon');


    /**
      unique ID that identifies session
    @property id
     */

    DockSession.prototype.id = null;


    /**
      TCP socket for device comms
    @property socket
     */

    DockSession.prototype.socket = null;


    /**
      Default timeout in seconds if no comms activity
    @property kDefaultTimeout
     */

    DockSession.prototype.kDefaultTimeout = 30;


    /**
      Newton device instance.
    @property newtonDevice
     */

    DockSession.prototype.newtonDevice = null;


    /**
      Info used to communicate with newton device. we send this info in session
      negotiation. this describes us as an newton sync compatible app. 
    @property desktopInfo
     */

    DockSession.prototype.desktopInfo = null;


    /**
      password used for protection of dock connection. by default no password
      protection is used
    @property sessionPwd
     */

    DockSession.prototype.sessionPwd = null;


    /**
    @class DockSession
    @constructor
     */

    function DockSession(options) {
      if (options) {
        _.extend(this, _.pick(options, ['id', 'socket', 'kDefaultTimeout', 'sessionPwd', 'newtonDevice']));
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
      this.initDockInfo();
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
          return _this.newtonDevice.initSyncSession();
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.emit("initialized", _this.newtonDevice);
        };
      })(this))["catch"]((function(_this) {
        return function(error) {
          _this.emit("error", error);
          return setTimeout(function() {
            return _this.endSession();
          }, 1000);
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
      var newtonNameInfo;
      newtonNameInfo = null;
      return this.receiveCommand('kDNewtonName').then((function(_this) {
        return function(newtonNameInfo_) {
          newtonNameInfo = newtonNameInfo_;
          return _this.sendCommand('kDDesktopInfo', _this.desktopInfo);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.receiveCommand('kDNewtonInfo');
        };
      })(this)).then((function(_this) {
        return function(newtonInfo) {
          newtonNameInfo.socket = _this.socket;
          newtonNameInfo.protocolVersion = newtonInfo.protocolVersion;
          newtonNameInfo.encryptedKey1 = newtonInfo.encryptedKey1;
          newtonNameInfo.encryptedKey2 = newtonInfo.encryptedKey2;
          return _this.newtonDevice = new NewtonDevice(newtonNameInfo);
        };
      })(this));
    };


    /**
      Init dock info for session negotiation
    @method initDockInfo
     */

    DockSession.prototype.initDockInfo = function() {
      var key1, key2;
      key1 = Math.ceil(Math.random() * 2147483647);
      key2 = Math.ceil(Math.random() * 2147483647);
      this.desktopInfo = {
        protocolVersion: 10,
        desktopType: 0,
        encryptedKey1: key1,
        encryptedKey2: key2,
        sessionType: DockSession.sessionTypes.kSettingUpSession,
        allowSelectiveSync: 0
      };
      return this.desktopInfo.desktopApps = [
        {
          name: "Newton Connection",
          id: 2,
          version: 1
        }
      ];
    };


    /**
      configure which icons will appear in Dock app at Newton device
    @method setDockIcons
     */

    DockSession.prototype._setDockIcons = function() {
      var whichIcons;
      whichIcons = DockSession.dockIcons.kSyncIcon;
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
      return this.receiveCommand('kDPassword').then((function(_this) {
        return function(receivedKey) {
          var newtonKey, sendKeys;
          receivedKey = _this._decryptKey(receivedKey);
          if (receivedKey.encryptedKey1 === _this.desktopInfo.encryptedKey1 && _) {
            receivedKey.encryptedKey2 === _this.desktopInfo.encryptedKey2;
            newtonKey = _this.newtonDevice.getEncryptedKeys();
            sendKeys = _this._encryptKey(newtonKey);
            return _this.sendCommand('kDPassword', sendKeys).then(function() {
              if (_this.sessionPwd != null) {
                return _this.receiveCommand('kDResult').then(function(pwdResult) {
                  if (pwdResult !== 0) {
                    throw new Error("Invalid Password");
                  }
                });
              } else {
                return Q();
              }
            });
          } else {
            return _this.delay(500).then(function() {
              return _this.sendCommand('kDPWWrong');
            }).then(function() {
              return _this._negotiatePassword();
            });
          }
        };
      })(this));
    };


    /**
      Encrypt newtonInfo keys with Newton variant DES algorithm
    @method encryptKeys
     */

    DockSession.prototype._encryptKey = function(newtonKey) {
      var encryptedData, encryptedKey, keyData;
      keyData = new Buffer(8);
      keyData.writeUInt32BE(newtonKey.encryptedKey1, 0);
      keyData.writeUInt32BE(newtonKey.encryptedKey2, 4);
      encryptedData = NewtonDesCrypto.encryptBlock(this.sessionPwd, keyData.toString('hex'));
      encryptedKey = {
        encryptedKey1: parseInt('0x' + encryptedData.slice(0, 8)),
        encryptedKey2: parseInt('0x' + encryptedData.slice(8, 16))
      };
      return encryptedKey;
    };


    /**
      Decrypt received desktopInfo key pair
    @method encryptKeys
     */

    DockSession.prototype._decryptKey = function(desktopKey) {
      var decryptedData, decryptedKey, keyData;
      keyData = new Buffer(8);
      keyData.writeUInt32BE(desktopKey.encryptedKey1, 0);
      keyData.writeUInt32BE(desktopKey.encryptedKey2, 4);
      decryptedData = NewtonDesCrypto.decryptBlock(this.sessionPwd, keyData.toString('hex'));
      decryptedKey = {
        encryptedKey1: parseInt('0x' + decryptedData.slice(0, 8)),
        encryptedKey2: parseInt('0x' + decryptedData.slice(8, 16))
      };
      return decryptedKey;
    };


    /**
      End session with device
    @method endSession
     */

    DockSession.prototype.endSession = function() {
      return setTimeout((function(_this) {
        return function() {
          _this.socket.end();
          _this.emit("finished", _this);
          return _this.dispose();
        };
      })(this), 1000);
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
      properties = ['socket', 'newtonDevice'];
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
