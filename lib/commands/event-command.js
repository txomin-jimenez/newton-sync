
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
  var EventCommand, _;

  _ = require('lodash');

  module.exports = EventCommand = (function() {

    /**
      generate a command from data (usually from app data)
    @method parse
    @static
     */
    EventCommand.parse = function(command, data) {
      var opts;
      opts = {
        id: null,
        name: null,
        length: null,
        data: null
      };
      return new EventCommand(opts);
    };


    /**
      generate a command from data buffer received (usually from Newton)
    @method parseFromBinary
    @static
     */

    EventCommand.parseFromBinary = function(buffer) {
      var opts;
      console.log(buffer);
      opts = null;
      return new EventCommand(opts);
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
      payload data if an  payload data if any
    @property data
     */

    EventCommand.prototype.data = null;


    /**
    @class EventCommand
    @constructor
     */

    function EventCommand(options) {
      if (options) {
        _.extend(this, _.pick(options, ['id', 'name', 'length', 'data']));
      }
    }


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
