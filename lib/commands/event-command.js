
/**
  Newton communicates with the desktop by exchanging Newton event commands.
  The general command structure looks like this:
    ULong 'newt' // event header
    ULong 'dock' // event header
    ULong 'aaaa' // specific command
    ULong length // the length in bytes of the following data
    UChar data[] // data, if any
  Note
  • The length associated with each command is the actual length in bytes of the
    data following the length field.
  • Data is padded with nulls to a 4 byte boundary.
  • Multi-byte values are in big-endian order.
  • Strings are null-terminated 2-byte UniChar strings unless otherwise
    specified.
  • NewtonScript objects are sent in Newton Streamed Object Format (NSOF) (see
    the Newton Formats document, chapter 4).

  All commands begin with the 'newt', 'dock' event header as shown in the
  general form. For simplicity, they are not included or implemented here
@class EventCommand
 */

(function() {
  var EventCommand, EventEmitter, Utils, _, dockCommands, loadCommClasses, path, recursiveReadSync;

  path = require('path');

  _ = require('lodash');

  EventEmitter = require('events').EventEmitter;

  recursiveReadSync = require('recursive-readdir-sync');

  Utils = require('../utils');

  dockCommands = {};

  loadCommClasses = function() {
    if (_.size(dockCommands) > 0) {
      return;
    }
    return recursiveReadSync(__dirname).forEach(function(commandFilename) {
      var commandClass, err;
      try {
        commandClass = require(commandFilename);
        if (commandClass.id != null) {
          dockCommands[commandClass.id] = commandClass;
          return dockCommands[commandClass.prototype.name] = commandClass;
        }
      } catch (_error) {
        err = _error;
        console.log("error loading event class: " + commandFilename + ":");
        return console.log(err);
      }
    });
  };

  module.exports = EventCommand = (function() {
    EventCommand._dockCommands = dockCommands;

    _.extend(EventCommand.prototype, EventEmitter.prototype);


    /**
      generate a command from JSON data (usually from app data)
    @method parse
    @static
     */

    EventCommand.parse = function(command, data) {
      var commClass, opts;
      loadCommClasses();
      commClass = dockCommands[command];
      if (commClass == null) {
        console.warn(command + " command not implemented!");
        commClass = EventCommand;
      }
      opts = {
        data: data
      };
      return new commClass(opts);
    };


    /**
     get command ID from binary command buffer
    @method getCommandId
     */

    EventCommand.getCommandId = function(buffer) {
      return buffer.toString('ascii', 8, 12);
    };


    /**
      generate a command from data buffer received (usually from Newton)
    @method parseFromBinary
    @static
     */

    EventCommand.parseFromBinary = function(buffer) {
      var commClass, commId, data, opts;
      loadCommClasses();
      commId = EventCommand.getCommandId(buffer);
      commClass = dockCommands[commId];
      if (commClass == null) {
        console.warn(commId + " command not implemented!");
        commClass = EventCommand;
      }
      data = buffer.slice(12);
      opts = {
        id: commId,
        name: commClass.prototype.name,
        data: data
      };
      return new commClass(opts);
    };


    /**
      specific command (4 letter) id ex: 'sync', 'cres'
    @property id
     */

    EventCommand.prototype.id = null;


    /**
      specific command long name ex: 'kDRequestToDock'
    @property name
     */

    EventCommand.prototype.name = null;


    /**
      the length in bytes of the following data
    @property length
     */

    EventCommand.prototype.length = null;


    /**
      payload data if any
    @property data
     */

    EventCommand.prototype.data = null;


    /**
    @class EventCommand
    @constructor
     */

    function EventCommand(options) {
      if (options) {
        _.extend(this, _.pick(options, ['id', 'name', 'length']));
        if (options.data instanceof Buffer) {
          if (options.data.length > 4) {
            this.dataFromBinary(options.data);
          } else {
            this.data = {};
          }
        } else {
          this.data = options.data;
        }
      }
    }


    /**
      create a binary buffer representation of Command according to specification
      this buffer can be sent to device
    @method toBinary
     */

    EventCommand.prototype.toBinary = function() {
      var commandBuffer, dataBuffer, padBuffer, resBuffPadding, resBuffer;
      commandBuffer = new Buffer(12);
      commandBuffer.write("newtdock", 0, "ascii");
      commandBuffer.write(this.id, 8, "ascii");
      dataBuffer = this.dataToBinary();
      resBuffer = Buffer.concat([commandBuffer, dataBuffer]);
      resBuffPadding = resBuffer.length % 4;
      if (resBuffPadding === 0) {
        return resBuffer;
      } else {
        padBuffer = new Buffer(4 - resBuffPadding);
        padBuffer.fill(0);
        return Buffer.concat([resBuffer, padBuffer]);
      }
    };


    /**
      create a binary buffer representation of data.
      each command will extened this class and implement as appropiate
      usually only Dock --to--> Newton commands will implement it
    @method dataToBinary
     */

    EventCommand.prototype.dataToBinary = function() {
      var data;
      data = new Buffer(4);
      data.writeUInt32BE(0, 0);
      return data;
    };


    /**
      converts binary data to JSON.
      each command will extened this class and implement as appropiate
      usually only Newton --to--> Dock commands will implement it
    @method dataFromBinary
     */

    EventCommand.prototype.dataFromBinary = function(dataBuffer) {
      return {};
    };


    /**
    @method dispose
     */

    EventCommand.prototype.dispose = function() {
      var i, len, prop, properties;
      if (this.disposed) {
        return;
      }
      this.emit('dispose', this);
      properties = ['data'];
      for (i = 0, len = properties.length; i < len; i++) {
        prop = properties[i];
        delete this[prop];
      }
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return EventCommand;

  })();

}).call(this);
