###*
  Handle all Newton Device information related command and process.
@class NewtonDevice
###
Q                 = require 'q'
_                 = require 'lodash'
net               = require 'net'

CommandBroker     = require './commands/command-broker'
StateMachine      = require './commands/state-machine'
Utils             = require './utils'
NewtonStorage     = require './newton-storage'

module.exports = class NewtonDevice
  
  ###*
    TCP socket for device comms
  @property socket
  ###
  socket: null
  
  ###*
  @property name
  ###
  name: null

  # NewtonInfo attributes

  # Newton Information block, as returned by kDNewtonName.
  # A unique id to identify a particular newton 
  fNewtonID: null

  # A decimal integer indicating the manufacturer of the device
  fManufacturer: null

  # A decimal integer indicating the hardware type of the device
  fMachineType: null

  # A decimal number indicating the major and minor ROM version numbers
  # The major number is in front of the decimal, the minor number after
  fROMVersion: null

  # A decimal integer indicating the language (English, German, French)
  # and the stage of the ROM (alpha, beta, final) 
  fROMStage: null

  fRAMSize: null

  # An integer representing the height of the screen in pixels	
  fScreenHeight: null

  # An integer representing the width of the screen in pixels
  fScreenWidth: null

  # 0 on an unpatched Newton and nonzero on a patched Newton
  fPatchVersion: null

  fNOSVersion: null

  # signature of the internal store
  fInternalStoreSig: null

  # An integer representing the number of vertical pixels per inch
  fScreenResolutionV: null

  # An integer representing the number of horizontal pixels per inch
  fScreenResolutionH: null

  # The bit depth of the LCD screen
  fScreenDepth: null

  # various bit flags 
  # 1 = has serial number
  # 2 = has target protocol
  fSystemFlags: null
  fSerialNumber: null
  fTargetProtocol:null

  ###*
    TCP socket for device comms
  @property socket
  ###
  socket: null
 
  ###*
  @class NewtonDevice
  @constructor
  ###
  constructor: (options) ->

    if options
      _.extend this, _.pick options, [
        'socket'
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

  
  ###*
    return a object with device info 
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

  getEncryptedKeys: ->

    _.pick(@,['encryptedKey1','encryptedKey2'])

  initSyncSession: ->
    
    # listen Sync command from Newton device. If user taps Dock app Sync icon
    # launch full sync
    @listenForCommand('kDSynchronize', @_fullSync)

    # Init store and soup info in order to consume them from lib functions
    @delay(1000)
    .then =>
      @_initStores()
    .then =>
      @sendCommand('kDOperationDone')
    .then =>
      @delay(1000)
  

  _initStores: ->

    @stores = {}
    @sendCommand('kDGetStoreNames')
    .then =>
      @receiveCommand('kDStoreNames')
    .then (stores) =>
      _.reduce stores, (soFar, store_) =>
        soFar.then =>
          store_.socket = @socket
          store = @stores[store_.name] = new NewtonStorage(store_)
          store.getSoups()
      , Q()

  _fullSync: =>

    if not @isReady()
      # if we are processing respond already busy
      @sendCommand('kDResult', {errorCode: -28027})
    else
      @_initFullSync()
      .then =>
        @_syncStores()
      .then =>
        @sendCommand('kDOperationDone')
  
  _initFullSync: ->
    
    @sendCommand('kDGetSyncOptions')
    .then =>
      @receiveCommand('kDSyncOptions')
    .then (syncOptions) =>
      console.log "received sync options:"
      console.log syncOptions
      @sendCommand('kDLastSyncTime')
    .then =>
      @receiveCommand('kDCurrentTime')
    .then (newtonTime) =>
      console.log "Newton time: "
      console.log newtonTime
  
  _syncStores: ->

    console.log "syncStores"

    #Q.all(_.map(@stores, (store) =>
      #console.log "sync store #{store.name}"
      #store.sync()
    #)).then =>
    _.reduce @stores, (soFar, store) ->
      soFar.then ->
        store.sync()
    , Q()
  
  ###*
  @method sync
  ###
  initSync: ->
    
    #@receiveCommand('kDRequestToSync')
    #@receiveCommand('kDSynchronize')
    #.then =>
      #@sendCommand('kDDesktopControl')
    #.then =>
      #@sendCommand('kDSynchronize')
    #.then =>
      #@receiveCommand('kDResult')
    #.then =>
 
    @sendCommand('kDDesktopControl')
    .then =>
      @sendCommand('kDRequestToSync')
      #@sendCommand('kDSynchronize')
    .then =>
      @receiveCommand('kDResult')
      #@receiveCommand('kDSynchronize')
    .then =>
      @sendCommand('kDGetSyncOptions')
    .then =>
      @receiveCommand('kDSyncOptions')
    .then (syncOptions) =>
      console.log "received sync options:"
      console.log syncOptions
      @sendCommand('kDLastSyncTime')
    .then =>
      @receiveCommand('kDCurrentTime')
    .then (newtonTime) =>
      console.log "Newton time: "
      console.log newtonTime
  
  finishSync: ->
    @sendCommand('kDOperationDone')
 

  getSoup: (soupName) ->
    
    # get from internal store for now
    @stores['Internal'].setCurrentStore()
    .then (result) =>
      @stores['Internal'].soups[soupName]
  
  
  ###*
  @method dispose
  ###
  dispose: ->

    return if @disposed

    @emit 'dispose', this
    
    @removeAllListeners()

    #properties = [
      #'socketConnection',
      #'newtonDevice',
    #]

    #delete this[prop] for prop in properties
    
    @disposed = true

    # You’re frozen when your heart’s not open.
    Object.freeze? this
