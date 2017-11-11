
/**
@class NewtonSoup
 */

(function() {
  var CommandConsumer, EventEmitter, NewtonSoup, Q, Utils, _, net;

  Q = require('q');

  _ = require('lodash');

  net = require('net');

  EventEmitter = require('events').EventEmitter;

  CommandConsumer = require('./commands/command-consumer');

  Utils = require('./utils');

  module.exports = NewtonSoup = (function() {
    _.extend(NewtonSoup.prototype, EventEmitter.prototype);


    /**
      commandBroker instance for command exchange
    @property commandBroker
     */

    NewtonSoup.prototype.commandBroker = null;


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
      Soup data when loaded from device
    @property data
     */

    NewtonSoup.prototype.data = null;


    /**
    @class NewtonSoup
    @constructor
     */

    function NewtonSoup(options) {
      if (options) {
        _.extend(this, _.pick(options, ['commandBroker', 'name']));
      }
      _.extend(this, CommandConsumer);
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
      var tx;
      this.data = [];
      tx = this.newCommandTransaction();
      return tx.sendCommand('kDSetSoupGetInfo', this.name).then(function() {
        return tx.receiveCommand(['kDSoupInfo', 'kDResult']);
      }).then((function(_this) {
        return function(command) {
          var soupInfo;
          if (command.name === 'kDSoupInfo') {
            soupInfo = command.data;
            if (soupInfo != null) {
              _this.nckLastBackupTime = Utils.newtonTime.toJSON(soupInfo.NCKLastBackupTime);
              _.extend(_this, _.pick(soupInfo, ['customFields']));
              if (soupInfo.soupDef != null) {
                _.extend(_this, _.pick(soupInfo.soupDef, ['name', 'userName', 'userDescr', 'ownerApp', 'ownerAppName', 'indexes', 'initHook']));
              }
            }
          }
          tx.finish();
          return _this.allEntries(function(entry) {
            return _this.data.push(entry);
          });
        };
      })(this));
    };


    /**
      Iterate all entries from soup and execute processEntryFn iterator
    @method allEntries
     */

    NewtonSoup.prototype.allEntries = function(processEntryFn) {
      var tx;
      tx = this.newCommandTransaction();
      return this.setCurrentSoup(tx).then(function() {
        return tx.sendCommand('kDSendSoup');
      }).then(function() {
        var deferred, receiveEntry;
        deferred = Q.defer();
        receiveEntry = function() {
          return tx.receiveCommand(['kDEntry', 'kDBackupSoupDone']).then(function(command) {
            if (command.name === 'kDEntry') {
              receiveEntry();
              return processEntryFn(command.data);
            } else {
              tx.finish();
              return deferred.resolve();
            }
          })["catch"](function(err) {
            return deferred.reject(err);
          });
        };
        receiveEntry();
        return deferred.promise;
      });
    };


    /**
      Newton must know before entry operations which soup we want to handle
    @method setCurrentSoup
     */

    NewtonSoup.prototype.setCurrentSoup = function(tx) {
      if (this.commandBroker.currentSoup === this.name) {
        return Q();
      } else {
        console.log("set current soup " + this.name);
        return tx.sendCommand('kDSetCurrentSoup', this.name).then(function() {
          return tx.receiveCommand('kDResult');
        }).then((function(_this) {
          return function(result) {
            if ((result != null ? result.errorCode : void 0) !== 0) {
              throw new Error("error " + result.errorCode + " setting current soup " + _this.name);
            } else {
              _this.commandBroker.currentSoup = _this.name;
            }
            return null;
          };
        })(this));
      }
    };


    /**
      Get entry from soup by entry ID
    @method getEntry
     */

    NewtonSoup.prototype.getEntry = function(docId) {
      var tx;
      tx = this.newCommandTransaction();
      return this.setCurrentSoup(tx).then(function() {
        return tx.sendCommand('kDReturnEntry', docId);
      }).then(function() {
        return tx.receiveCommand('kDEntry');
      }).then(function(entry) {
        tx.finish();
        return entry;
      });
    };


    /**
      Add new entry to soup
    @method addEntry
     */

    NewtonSoup.prototype.addEntry = function(entryData) {
      var tx;
      tx = this.newCommandTransaction();
      return this.setCurrentSoup(tx).then(function() {
        return tx.sendCommand('kDAddEntry', entryData);
      }).then(function() {
        return tx.receiveCommand('kDAddedID');
      }).then(function(newId) {
        tx.finish();
        return newId;
      });
    };


    /**
      Delete entry from soup by ID
    @method deleteEntry
     */

    NewtonSoup.prototype.deleteEntry = function(entryIds) {
      var tx;
      if (entryIds.length == null) {
        entryIds = [entryIds];
      }
      tx = this.newCommandTransaction();
      return this.setCurrentSoup(tx).then(function() {
        return tx.sendCommand('kDDeleteEntries', entryIds);
      }).then(function() {
        return this.receiveCommand('kDResult');
      }).then(function(result) {
        tx.finish();
        return result;
      });
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
      properties = ['commandBroker', 'indexes'];
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

//# sourceMappingURL=newton-soup.js.map
