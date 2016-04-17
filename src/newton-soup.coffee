###*
@class NewtonSoup
###
Q                 = require 'q'
_                 = require 'lodash'
net               = require 'net'

CommandBroker     = require './commands/command-broker'
StateMachine      = require './commands/state-machine'
Utils             = require './utils'

module.exports = class NewtonSoup
  
  ###*
    TCP socket for device comms
  @property socket
  ###
  socket: null
  
  ###*
    Soup name
  @property name
  ###
  name: null

  ###*
    owner Newton app identifier. It describes which app this soup belongs to  
  @property ownerApp
  ###
  ownerApp: null
  
  ###*
    owner Newton app complete name 
  @property ownerAppName
  ###
  ownerAppName: null

  ###*
    Extended name. I think it's used for show it to the user 
  @property userName
  ###
  userName: null
  
  ###*
    Soup description. I think its used for show it to the user 
  @property userDescr
  ###
  userDescr: null

  ###*
    Soup indexes. Indexes are defined for speed up queries and sorts in soups 
  @property indexes
  ###
  indexes: null

  ###*
    User defined fields (not sure about this)  
  @property customFields 
  ###
  customFields: null
  
  ###*
    unknown. don't know yet   
  @property initHook
  ###
  initHook: null

  ###*
    Last time NCK did a soup backup 
  @property nckLastBackupTime
  ###
  nckLastBackupTime: null
  
  ###*
  @class NewtonSoup
  @constructor
  ###
  constructor: (options) ->

    if options
      _.extend this, _.pick options, [
        'socket'
        'name'
      ]
    
    # add machine-state and event emit capability
    _.extend @, StateMachine
    
    # send/receive Newton Dock Commands
    _.extend @, CommandBroker
    
    @_initialize(options)
  
  ###*
    all init method go here
  @method initialize
  ###
  _initialize: (options) ->
    
    null
  
  ###*
    Get Soup info from device. used in soup initialization
  @method loadSoupInfo
  ###
  loadSoupInfo: ->

    @sendCommand('kDSetSoupGetInfo', @name)
    .then =>
      @receiveCommand('kDSoupInfo')
    .then (soupInfo) =>
      # TO-DO: if soup didn't change since last sync kDResult is received
      # and soupInfo wont be received
      
      # fix this name because we want camelCase names
      @nckLastBackupTime = Utils.newtonTime.toJSON(soupInfo.NCKLastBackupTime)

      if soupInfo?
        _.extend @, _.pick soupInfo, [
          'customFields'
        ]

      if soupInfo.soupDef?
        _.extend @, _.pick soupInfo.soupDef, [
          'name'
          'userName'
          'userDescr'
          'ownerApp'
          'ownerAppName'
          'indexes'
          'initHook'
        ]

  ###*
    Iterate all entries from soup and execute processEntryFn iterator
  @method allEntries  
  ###
  allEntries: (processEntryFn) ->

    @sendCommand('kDSetCurrentSoup', @name)
    .then =>
      @receiveCommand('kDResult')
    .then (result_)=>
      @sendCommand('kDSendSoup')
    .then =>
      @listenForCommand('kDEntry',null, processEntryFn, 'kDBackupSoupDone')
  
  ###*
    Newton must know before entry operations which soup we want to handle 
  @method setCurrentSoup
  ###
  setCurrentSoup: ->

    @sendCommand('kDSetCurrentSoup', @name)
    .then =>
      @receiveCommand('kDResult')
    .then (result) =>
      if result?.errorCode isnt 0
        throw new Error "error #{result.errorCode} setting current soup #{@name}"

  ###*
    Get entry from soup by entry ID
  @method getEntry  
  ###
  getEntry: (docId) ->

    @setCurrentSoup()
    .then =>
      @sendCommand('kDReturnEntry',docId)
    .then =>
      @receiveCommand('kDEntry')
  
  ###*
    Add new entry to soup
  @method addEntry
  ###
  addEntry: (entryData) ->

    @setCurrentSoup()
    .then =>
      @sendCommand('kDAddEntry',entryData)
    .then =>
      @receiveCommand('kDAddedID')
  
  ###*
    Delete entry from soup by ID 
  @method deleteEntry
  ###
  deleteEntry: (entryIds) ->

    if not entryIds.length?
      entryIds = [entryIds]

    @setCurrentSoup()
    .then =>
      @sendCommand('kDDeleteEntries', entryIds)
    .then =>
      @receiveCommand('kDResult')

  ###*
  @method dispose
  ###
  dispose: ->

    return if @disposed

    @emit 'dispose', this
    
    @removeAllListeners()

    properties = [
      'socket',
      'indexes',
    ]

    delete this[prop] for prop in properties
    
    @disposed = true

    # You’re frozen when your heart’s not open.
    Object.freeze? this
