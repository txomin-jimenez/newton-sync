###*
@class NewtonSoup
###
Q                 = require 'q'
_                 = require 'lodash'
net               = require 'net'
EventEmitter      = require('events').EventEmitter

CommandConsumer   = require './commands/command-consumer'
Utils             = require './utils'

module.exports = class NewtonSoup

  # event emit feature
  _.extend @prototype, EventEmitter.prototype
  
  ###*
    commandBroker instance for command exchange
  @property commandBroker
  ###
  commandBroker: null

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
    Soup data when loaded from device
  @property data
  ###
  data: null

  ###*
  @class NewtonSoup
  @constructor
  ###
  constructor: (options) ->

    if options
      _.extend this, _.pick options, [
        'commandBroker'
        'name'
      ]

    # send/receive Newton Dock Commands
    _.extend @, CommandConsumer
    
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
  loadSoupInfo:  ->

    @data = []

    tx = @newCommandTransaction()
  
    tx.sendCommand('kDSetSoupGetInfo', @name)
    .then ->
      # if soup didn't change since last sync kDResult is received
      # and soupInfo wont be received
      tx.receiveCommand(['kDSoupInfo','kDResult'])
    .then (command) =>

      if command.name is 'kDSoupInfo'

        soupInfo = command.data

        if soupInfo?
          # fix this name because we want camelCase names
          @nckLastBackupTime = Utils.newtonTime
          .toJSON(soupInfo.NCKLastBackupTime)
          
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
      tx.finish()
      
      @allEntries (entry) =>
        @data.push entry

      
        
  ###*
    Iterate all entries from soup and execute processEntryFn iterator
  @method allEntries
  ###
  allEntries: (processEntryFn) ->

    tx = @newCommandTransaction()

    @setCurrentSoup(tx)
    .then ->
      tx.sendCommand('kDSendSoup')
    .then ->

      deferred = Q.defer()

      # receive loop for entry commands from Newton device
      receiveEntry = ->
        tx.receiveCommand(['kDEntry','kDBackupSoupDone'])
        .then (command) ->
          if command.name is 'kDEntry'
            # wait for next entry
            receiveEntry()
            processEntryFn(command.data)
          else
            # all entries received. finish
            tx.finish()
            deferred.resolve()
        .catch (err) ->
          deferred.reject(err)
      ####
      receiveEntry()

      deferred.promise

  ###*
    Newton must know before entry operations which soup we want to handle
  @method setCurrentSoup
  ###
  setCurrentSoup: (tx) ->

    if @commandBroker.currentSoup is @name
      Q()
    else
      console.log "set current soup #{@name}"
      tx.sendCommand('kDSetCurrentSoup', @name)
      .then ->
        tx.receiveCommand('kDResult')
      .then (result) =>
        if result?.errorCode isnt 0
          throw new Error "error #{result.errorCode} setting current
          soup #{@name}"
        else
          @commandBroker.currentSoup = @name

        null

  ###*
    Get entry from soup by entry ID
  @method getEntry
  ###
  getEntry: (docId) ->

    tx = @newCommandTransaction()

    @setCurrentSoup(tx)
    .then ->
      tx.sendCommand('kDReturnEntry',docId)
    .then ->
      tx.receiveCommand('kDEntry')
    .then (entry) ->
      tx.finish()
      entry

  ###*
    Add new entry to soup
  @method addEntry
  ###
  addEntry: (entryData) ->

    tx = @newCommandTransaction()

    @setCurrentSoup(tx)
    .then ->
      tx.sendCommand('kDAddEntry',entryData)
    .then ->
      tx.receiveCommand('kDAddedID')
    .then (newId) ->
      tx.finish()
      newId

  ###*
    Delete entry from soup by ID
  @method deleteEntry
  ###
  deleteEntry: (entryIds) ->

    # array of IDs to delete accepted
    if not entryIds.length?
      entryIds = [entryIds]

    tx = @newCommandTransaction()

    @setCurrentSoup(tx)
    .then ->
      tx.sendCommand('kDDeleteEntries', entryIds)
    .then ->
      @receiveCommand('kDResult')
    .then (result) ->
      tx.finish()
      result

  ###*
  @method dispose
  ###
  dispose: ->

    return if @disposed

    @emit 'dispose', this

    @removeAllListeners()

    properties = [
      'commandBroker',
      'indexes',
    ]

    delete this[prop] for prop in properties

    @disposed = true

    # You’re frozen when your heart’s not open.
    Object.freeze? this
