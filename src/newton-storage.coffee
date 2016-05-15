###*
@class NewtonStorage 
###
Q                 = require 'q'
_                 = require 'lodash'
net               = require 'net'

CommandConsumer   = require './commands/command-consumer'
StateMachine      = require './commands/state-machine'
Utils             = require './utils'

NewtonSoup        = require './newton-soup'

module.exports = class NewtonStorage
  
  ###*
    commandBroker instance for command exchange
  @property commandBroker
  ###
  commandBroker: null
  
  ###*
  @property name
  ###
  name: null

  ###*
    Internal identifier
  @property signature
  ###
  signature: null

  ###*
    Storage size in bytes  
  @property totalSize
  ###
  totalSize: null

  ###*
    Used storage in bytes 
  @property usedSize
  ###
  usedSize: null

  ###*
    Storage kind: (Internal/External) 
  @property kind
  ###
  kind: null

  ###*
    Storage info 
  @property info
  ###
  info: null

  ###*
    Write protection 
  @property readOnly
  ###
  readOnly: null

  ###*
    password protected storage 
  @property storePassword
  ###
  storePassword: null

  ###*
    Store is default store for new entries 
  @property defaultStore
  ###
  defaultStore: null

  ###*
    store revision identifier 
  @property storeVersion
  ###
  storeVersion: null
  
  ###*
  @class NewtonStorage
  @constructor
  ###
  constructor: (options) ->

    # fix some input names as usually this constructor receives this data
    # from Newton message, and value keys don't follow camelCase rule
    options.totalSize = options.TotalSize if options.TotalSize?
    options.usedSize = options.UsedSize if options.UsedSize?
    options.storePassword = options.storepassword if options.storepassword?
    options.storeVersion = options.storeversion if options.storeversion?

    if options
      _.extend this, _.pick options, [
        'commandBroker'
        'name'
        'signature'
        'totalSize'
        'usedSize'
        'kind'
        'info'
        'readOnly'
        'storePassword'
        'defaultStore'
        'storeVersion'
      ]
    
    # add machine-state and event emit capability
    _.extend @, StateMachine
    
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
    Load soup names from device and initialize instances for later use
  @method initSoups
  ###
  initSoups:  ->
    
    tx = @newCommandTransaction()
    
    storeFrame = @toFrame()
    
    @soups = {}
    tx.sendCommand('kDSetStoreGetNames', storeFrame)
    .then ->
      tx.receiveCommand('kDSoupNames')
    .then (soups_) =>
      @commandBroker.currentStorage = @name
      tx.finish()
      _.reduce soups_, (soFar, soupName) =>
        soFar.then =>
          # Avoid packages from now
          if soupName isnt 'Packages'
            soup = @soups[soupName] = new NewtonSoup
              name: soupName
              commandBroker: @commandBroker
            # load soup info for later use  
            soup.loadSoupInfo()
          else
            Q()
      , Q()
  
  ###*
    Set store as current before soup operations
  @method setCurrentStore
  ###
  setCurrentStore: (tx) ->
    
    if @commandBroker.currentStorage is @name
      Q()
    else
      storeFrame = @toFrame()

      tx.sendCommand('kDSetCurrentStore', storeFrame)
      .then ->
        tx.receiveCommand('kDResult')
      .then (result) =>
        if result?.errorCode isnt 0
          throw new Error "error #{result.errorCode} setting current store."
        else
          @commandBroker.currentStorage = @name

        null
  
  ###*
    Store frame representation as needed for Newton command exchange 
  @method toFrame
  ###
  toFrame: ->
    
    return(
      name: @name
      kind: @kind
      signature: @signature
    )

  ###*
  @method dispose
  ###
  dispose: ->

    return if @disposed

    @emit 'dispose', this
    
    @removeAllListeners()
    
    # dispose soups
    if @soups?
      for soup in @soups
        soup.dispose()

    properties = [
      'socket'
      'name'
      'signature'
      'totalSize'
      'usedSize'
      'kind'
      'info'
      'readOnly'
      'storePassword'
      'defaultStore'
      'storeVersion'
      'soups'
    ]

    delete this[prop] for prop in properties
    
    @disposed = true

    # You’re frozen when your heart’s not open.
    Object.freeze? this
