###*
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
###

_                 = require 'lodash'

module.exports = class EventCommand
  
  ###*
    generate a command from data (usually from app data)
  @method parse
  @static
  ###
  @parse: (command, data) ->
    
    opts =
      id: null
      name: null
      length: null
      data: null
    
    new EventCommand opts
  ###*
    generate a command from data buffer received (usually from Newton)
  @method parseFromBinary
  @static
  ###
  @parseFromBinary: (buffer) ->
    console.log buffer
    opts = null
    new EventCommand opts
  ###*
    specific command (4 letter) id ex: 'sync', 'cres'
  @property id
  ###
  id: null
  
  ###*
    specific command long name ex: 'kDRequestToDock'
  @property name
  ###
  name: null
  
  ###*
    the length in bytes of the following data
  @property length
  ###
  length: null
  
  ###*
    payload data if an  payload data if any
  @property data
  ###
  data: null

  ###*
  @class EventCommand
  @constructor
  ###
  constructor: (options) ->
    
    if options
      _.extend this, _.pick options, [
        'id'
        'name'
        'length'
        'data'
      ]

  ###*
  @method dispose
  ###
  dispose: ->

    return if @disposed

    @emit 'dispose', this
    
    properties = [
      'data',
    ]

    delete this[prop] for prop in properties
    
    @disposed = true

    # You’re frozen when your heart’s not open.
    Object.freeze? this
