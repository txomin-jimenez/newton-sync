
/**
@class NewtonSoup
 */

(function() {
  var CommandBroker, NewtonSoup, Q, StateMachine, Utils, _, net;

  Q = require('q');

  _ = require('lodash');

  net = require('net');

  CommandBroker = require('./commands/command-broker');

  StateMachine = require('./commands/state-machine');

  Utils = require('./utils');

  module.exports = NewtonSoup = (function() {

    /**
      TCP socket for device comms
    @property socket
     */
    NewtonSoup.prototype.socket = null;


    /**
      Soup name
    @property name
     */

    NewtonSoup.prototype.name = null;


    /**
      owner Newton app identifier. It describes which app this soup belongs to  
    @property ownerApp
     */

    NewtonSoup.prototype.ownerApp = null;


    /**
      owner Newton app complete name 
    @property ownerAppName
     */

    NewtonSoup.prototype.ownerAppName = null;


    /**
      Extended name. I think it's used for show it to the user 
    @property userName
     */

    NewtonSoup.prototype.userName = null;


    /**
      Soup description. I think its used for show it to the user 
    @property userDescr
     */

    NewtonSoup.prototype.userDescr = null;


    /**
      Soup indexes. Indexes are defined for speed up queries and sorts in soups 
    @property indexes
     */

    NewtonSoup.prototype.indexes = null;


    /**
      User defined fields (not sure about this)  
    @property customFields
     */

    NewtonSoup.prototype.customFields = null;


    /**
      unknown. don't know yet   
    @property initHook
     */

    NewtonSoup.prototype.initHook = null;


    /**
      Last time NCK did a soup backup 
    @property nckLastBackupTime
     */

    NewtonSoup.prototype.nckLastBackupTime = null;


    /**
    @class NewtonSoup
    @constructor
     */

    function NewtonSoup(options) {
      if (options) {
        _.extend(this, _.pick(options, ['socket', 'name']));
      }
      _.extend(this, StateMachine);
      _.extend(this, CommandBroker);
      this._initialize(options);
    }


    /**
      all init method go here
    @method initialize
     */

    NewtonSoup.prototype._initialize = function(options) {
      return null;
    };


    /**
      Get Soup info from device. used in soup initialization
    @method loadSoupInfo
     */

    NewtonSoup.prototype.loadSoupInfo = function() {
      return this.sendCommand('kDSetSoupGetInfo', this.name).then((function(_this) {
        return function() {
          return _this.receiveCommand('kDSoupInfo');
        };
      })(this)).then((function(_this) {
        return function(soupInfo) {
          _this.nckLastBackupTime = Utils.newtonTime.toJSON(soupInfo.NCKLastBackupTime);
          if (soupInfo != null) {
            _.extend(_this, _.pick(soupInfo, ['customFields']));
          }
          if (soupInfo.soupDef != null) {
            return _.extend(_this, _.pick(soupInfo.soupDef, ['name', 'userName', 'userDescr', 'ownerApp', 'ownerAppName', 'indexes', 'initHook']));
          }
        };
      })(this));
    };


    /**
      Iterate all entries from soup and execute processEntryFn iterator
    @method allEntries
     */

    NewtonSoup.prototype.allEntries = function(processEntryFn) {
      return this.sendCommand('kDSetCurrentSoup', this.name).then((function(_this) {
        return function() {
          return _this.receiveCommand('kDResult');
        };
      })(this)).then((function(_this) {
        return function(result_) {
          return _this.sendCommand('kDSendSoup');
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.listenForCommand('kDEntry', null, processEntryFn, 'kDBackupSoupDone');
        };
      })(this));
    };


    /**
      Newton must know before entry operations which soup we want to handle 
    @method setCurrentSoup
     */

    NewtonSoup.prototype.setCurrentSoup = function() {
      return this.sendCommand('kDSetCurrentSoup', this.name).then((function(_this) {
        return function() {
          return _this.receiveCommand('kDResult');
        };
      })(this)).then((function(_this) {
        return function(result) {
          if ((result != null ? result.errorCode : void 0) !== 0) {
            throw new Error("error " + result.errorCode + " setting current soup " + _this.name);
          }
        };
      })(this));
    };


    /**
      Get entry from soup by entry ID
    @method getEntry
     */

    NewtonSoup.prototype.getEntry = function(docId) {
      return this.setCurrentSoup().then((function(_this) {
        return function() {
          return _this.sendCommand('kDReturnEntry', docId);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.receiveCommand('kDEntry');
        };
      })(this));
    };


    /**
      Add new entry to soup
    @method addEntry
     */

    NewtonSoup.prototype.addEntry = function(entryData) {
      return this.setCurrentSoup().then((function(_this) {
        return function() {
          return _this.sendCommand('kDAddEntry', entryData);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.receiveCommand('kDAddedID');
        };
      })(this));
    };


    /**
      Delete entry from soup by ID 
    @method deleteEntry
     */

    NewtonSoup.prototype.deleteEntry = function(entryIds) {
      if (entryIds.length == null) {
        entryIds = [entryIds];
      }
      return this.setCurrentSoup().then((function(_this) {
        return function() {
          return _this.sendCommand('kDDeleteEntries', entryIds);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.receiveCommand('kDResult');
        };
      })(this));
    };


    /**
    @method dispose
     */

    NewtonSoup.prototype.dispose = function() {
      var i, len, prop, properties;
      if (this.disposed) {
        return;
      }
      this.emit('dispose', this);
      this.removeAllListeners();
      properties = ['socket', 'indexes'];
      for (i = 0, len = properties.length; i < len; i++) {
        prop = properties[i];
        delete this[prop];
      }
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return NewtonSoup;

  })();

}).call(this);
