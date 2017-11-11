###*
  Handle all Newton Device information related command and process.
@class NewtonDevice
###
Q                 = require 'q'
_                 = require 'lodash'
net               = require 'net'
EventEmitter      = require('events').EventEmitter

CommandConsumer   = require './commands/command-consumer'
Utils             = require './utils'
NewtonStorage     = require './newton-storage'

module.exports = class NewtonDevice
  
  # event emit feature
  _.extend @prototype, EventEmitter.prototype
  
  ###*
    commandBroker instance for command exchange
  @property commandBroker
  ###
  commandBroker: null
  
  ###*
    Received Newton device name
  @property name
  ###
  name: null

  # NewtonInfo attributes
  # Newton Information block, as returned by kDNewtonName.
  
  ###*
    A unique id to identify a particular newton
  @property fNewtonID
  ###
  fNewtonID: null

  ###*
    A decimal integer indicating the manufacturer of the device
  @property fManufacturer
  ###
  fManufacturer: null

  ###*
    A decimal integer indicating the hardware type of the device
  @property fMachineType
  ###
  fMachineType: null

  ###*
    A decimal number indicating the major and minor ROM version numbers
    The major number is in front of the decimal, the minor number after
  @property fROMVersion
  ###
  fROMVersion: null

  ###*
    A decimal integer indicating the language (English, German, French)
    and the stage of the ROM (alpha, beta, final)
  @property fROMStage
  ###
  fROMStage: null

  ###*
    Device RAM size in bytes
  @property fRAMSize
  ###
  fRAMSize: null

  ###*
    An integer representing the height of the screen in pixels
  @property fScreenHeight
  ###
  fScreenHeight: null

  ###*
    An integer representing the width of the screen in pixels
  @property fScreenWidth
  ###
  fScreenWidth: null

  ###*
    0 on an unpatched Newton and nonzero on a patched Newton
  @property fPatchVersion
  ###
  fPatchVersion: null

  ###*
    Device's NewtonOS version
  @property fNOSVersion
  ###
  fNOSVersion: null

  ###*
    Signature (internal identifier) of the internal store
  @property fInternalStoreSig
  ###
  fInternalStoreSig: null

  ###*
    An integer representing the number of vertical pixels per inch
  @property fScreenResolutionV
  ###
  fScreenResolutionV: null

  ###*
    An integer representing the number of horizontal pixels per inch
  @property fScreenResolutionH
  ###
  fScreenResolutionH: null

  ###*
    The bit depth of the LCD screen
  @property fScreenDepth
  ###
  fScreenDepth: null

  ###*
    various System bit flags
    1 = has serial number
    2 = has target protocol
  @property fSystemFlags
  ###
  fSystemFlags: null
  
  ###*
    Device serial number if present
  @property fSerialNumber
  ###
  fSerialNumber: null
  
  ###*
    Target protocol if present
  @property fTargetProtocol
  ###
  fTargetProtocol: null

  ###*
  @class NewtonDevice
  @constructor
  ###
  constructor: (options) ->

    if options
      _.extend this, _.pick options, [
        'commandBroker'
        'fNewtonID'
        'fManufacturer'
        'fMachineType'
        'fROMVersion'
        'fROMStage'
        'fRAMSize'
        'fScreenWidth'
        'fScreenWidth'
        'fPatchVersion'
        'fNOSVersion'
        'fInternalStoreSig'
        'fScreenResolutionV'
        'fScreenResolutionH'
        'fScreenDepth'
        'fSystemFlags'
        'fSerialNumber'
        'fTargetProtocol'
        'name'
        'protocolVersion'
        'encryptedKey1'
        'encryptedKey2'
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
    Return a object with device info
  @method info
  ###
  info: ->
    _.pick @ ,[
      'fNewtonID'
      'fManufacturer'
      'fMachineType'
      'fROMVersion'
      'fROMStage'
      'fRAMSize'
      'fScreenWidth'
      'fScreenWidth'
      'fPatchVersion'
      'fNOSVersion'
      'fInternalStoreSig'
      'fScreenResolutionV'
      'fScreenResolutionH'
      'fScreenDepth'
      'fSystemFlags'
      'fSerialNumber'
      'fTargetProtocol'
      'name'
    ]
  
  ###*
    Get encryption keys used for session password exchange
  @method getEncryptedKeys
  ###
  getEncryptedKeys: ->

    _.pick(@,['encryptedKey1','encryptedKey2'])
  
  ###*
    Init device for sync session. used in session init. Storage and Soup info
    is pre-fetched for later sync process use
  @method initSyncSession
  ###
  initSyncSession: ->
    
    deferred = Q.defer()
    
    # listen Sync command from Newton device. If user taps Dock app Sync icon
    # launch full sync event
    #@listenForCommand('kDSynchronize', @_fullSync)

    # Init store and soup info in order to consume them from lib functions
    setTimeout =>
      return if @disposed
      #@_initFullSync()
      #.then =>
      @_initStores()
      .then ->
        deferred.resolve()
      .catch (err) ->
        deferred.reject(err)
    , 1000

    deferred.promise

  ###*
    Load store names from device and initialize instances to handle them
  @method initStores
  @private
  ###
  _initStores: ->

    tx = @newCommandTransaction()

    @stores = {}
    tx.sendCommand('kDGetStoreNames')
    .then ->
      tx.receiveCommand('kDStoreNames')
    .then (stores) =>
      tx.finish()
      _.reduce stores, (soFar, store_) =>
        soFar.then =>
          store_.commandBroker = @commandBroker
          store = @stores[store_.name] = new NewtonStorage(store_)
          # init soups in storage for later use
          store.initSoups()
      , Q()
    .then =>
      # Newton needs a done command
      tx = @newCommandTransaction()
      tx.delay(1000)
    .then ->
      tx.sendCommand('kDOperationDone')
    .then ->
      tx.delay(1000)
    .then ->
      tx.finish()

  ###*
  ###
  _fullSync: =>
    
    @_initFullSync()
    .then =>
      @delay(8000)
    .then =>
      @sendCommand('kDOperationDone')
    .then =>
      @notifyUser "Process finished", "Synchronization finished successfully"
    .then =>
      @sendCommand('kDOperationDone')
  
  ###*
    Negotiate sync process with Newton device
  @method initFullSync
  ###
  _initFullSync: ->
    
    tx = @newCommandTransaction()

    tx.sendCommand('kDGetSyncOptions')
    .then ->
      tx.receiveCommand('kDSyncOptions')
    .then (syncOptions) =>
      console.log "received sync options:"
      console.log syncOptions
      tx.sendCommand('kDLastSyncTime')
    .then ->
      tx.receiveCommand('kDCurrentTime')
    .then (newtonTime) ->
      console.log "Newton time: "
      console.log newtonTime
  
  initSync: ->
    @sendCommand('kDDesktopControl')
  
  finishSync: ->
    @sendCommand('kDOperationDone')

  getSoup: (soupName) ->
    
    # get from internal store for now
    @stores['Internal'].getSoup(soupName)

  appNames: ->
    
    tx = @newCommandTransaction()

    tx.sendCommand("kDGetAppNames")
    .then ->
      tx.receiveCommand("kDAppNames")
    .then (appNames) ->
      tx.sendCommand('kDOperationDone')
      tx.finish()
      appNames

  
  callRootMethod: (methodName, args...) ->

    tx = @newCommandTransaction()

    tx.sendCommand('kDCallRootMethod', {
      functionName: methodName
      functionArgs: args
    }).then ->
      tx.receiveCommand('kDCallResult')
    .then (result) ->
      tx.finish()
      result

  notifyUser: (title, message) ->
    
    setTimeout =>
      @callRootMethod 'Notify', 3, title , message
    , 500

  ###*
  @method dispose
  ###
  dispose: ->

    return if @disposed

    @emit 'dispose', this
    
    @removeAllListeners()
   
    # dispose stores
    if @stores?
      for store in @stores
        store.dispose()
    
    properties = [
      'commandBroker',
      'stores',
    ]

    delete this[prop] for prop in properties
    
    @disposed = true

    # You’re frozen when your heart’s not open.
    Object.freeze? this
