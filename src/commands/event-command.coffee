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
path              = require 'path'
_                 = require 'lodash'
EventEmitter      = require('events').EventEmitter
recursiveReadSync = require 'recursive-readdir-sync'

Utils             = require '../utils'

#######################################################################
#  Dynamically load all command classes
#  factory methods will parse input to this object to produce correct
#  instances.
dockCommands = {}

loadCommClasses = ->
  return if _.size(dockCommands) > 0
  recursiveReadSync(__dirname).forEach (commandFilename) ->
    try
      commandClass = require commandFilename
      if commandClass.id?
        # index class by id and name
        dockCommands[commandClass.id] = commandClass
        dockCommands[commandClass.prototype.name] = commandClass
    catch err
      console.log "error loading event class: #{commandFilename}:"
      console.log err
#
#######################################################################

module.exports = class EventCommand
  
  @_dockCommands = dockCommands

  # event emit feature
  _.extend EventCommand, EventEmitter.prototype
  
  ###*
    generate a command from JSON data (usually from app data)
  @method parse
  @static
  ###
  @parse: (command, data) ->
    loadCommClasses() # load classes if not loaded yet
    # command accepts id or name
    commClass = dockCommands[command]
    if not commClass?
      console.warn "#{command} command not implemented!"
      commClass = EventCommand
    
    opts =
      data: data
    
    new commClass opts
  
  ###*
    generate a command from data buffer received (usually from Newton)
  @method parseFromBinary
  @static
  ###
  @parseFromBinary: (buffer) ->
    loadCommClasses() # load classes if not loaded yet
    console.log buffer
    commId = Utils.protocol.getCommandId(buffer)
    # get correct class from events object
    commClass = dockCommands[commId]
    if not commClass?
      console.warn "#{commId} command not implemented!"
      commClass = EventCommand
    
    # slice data section of command message
    data = buffer.slice(12)

    opts =
      id: commId
      name: commClass.prototype.name
      data: data
    new commClass opts
  
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
    payload data if any
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
      ]
    
      # parse binary data to JSON if command is received from Newton device  
      if options.data instanceof Buffer
        @dataFromBinary(options.data)
      else
        # set JSON data object.
        @data = options.data

  ###*
    create a binary buffer representation of Command according to specification
    this buffer can be sent to device
  @method toBinary
  ###
  toBinary: ->
    commandBuffer = new Buffer(12)
    # Write header. All commands have same header
    commandBuffer.write("newtdock",0,"ascii")
    # Write command code
    commandBuffer.write(@id,8,"ascii")
    # serialize binary representation of command data
    dataBuffer = @dataToBinary()
    # concat two buffers in one as result
    Buffer.concat [commandBuffer, dataBuffer]
  
  ###*
    create a binary buffer representation of data.
    each command will extened this class and implement as appropiate
    usually only Dock --to--> Newton commands will implement it
  @method dataToBinary
  ###
  dataToBinary: ->
    # this boilerplate sets 0 as data payload 
    data = new Buffer(4)
    data.writeUInt32BE(0,0)
  
  ###*
    converts binary data to JSON.
    each command will extened this class and implement as appropiate
    usually only Newton --to--> Dock commands will implement it
  @method dataFromBinary
  ###
  dataFromBinary: (dataBuffer) ->
    {}

  ###*
  @method dispose
  ###
  dispose: ->

    return if @disposed

    @emit 'dispose', this
    
    properties = [
      'data'
    ]

    delete this[prop] for prop in properties
    
    @disposed = true

    # You’re frozen when your heart’s not open.
    Object.freeze? this
